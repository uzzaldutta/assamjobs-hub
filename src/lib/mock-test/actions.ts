
"use server";

import { createClient } from "@supabase/supabase-js";
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SESSION_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 1. JWT-like Stateless Session Logic
function signSession(data: any): string {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifySession(token: string): any {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) throw new Error("Malformed session token");
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  if (signature !== expectedSig) throw new Error("Invalid session signature");
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
}

// 2. Fetch Pre-Test Metadata (Public)
export async function getMockTestMetadata(testId: string) {
  const { data, error } = await supabaseAdmin
    .from("prep_mock_tests")
    .select("id, title, duration_minutes, total_marks, negative_marking, instructions, status, prep_exams(title, slug)")
    .eq("id", testId)
    .single();

  if (error || !data) throw new Error("Mock test not found");
  if (data.status === "DRAFT") throw new Error("This test is currently unavailable");

  // Get total question count
  const { count } = await supabaseAdmin
    .from("prep_mock_test_questions")
    .select("*", { count: 'exact', head: true })
    .eq("test_id", testId);

  return { ...data, question_count: count || 0 };
}

// 3. Start Secure Session
export async function startMockTestSession(testId: string) {
  // Verify test is published
  const { data: testData, error: testErr } = await supabaseAdmin
    .from("prep_mock_tests")
    .select("duration_minutes, status")
    .eq("id", testId)
    .single();

  if (testErr || !testData || testData.status === "DRAFT") {
    throw new Error("Unauthorized test access");
  }

  // Fetch Questions (WITHOUT ANSWERS)
  // We need to join prep_mock_test_questions and prep_questions
  const { data: questions, error: qErr } = await supabaseAdmin
    .from("prep_mock_test_questions")
    .select(`
      order_index,
      prep_questions (
        id, question_text, options, difficulty
      )
    `)
    .eq("test_id", testId)
    .order("order_index", { ascending: true });

  if (qErr || !questions) throw new Error("Failed to load questions");

  const formattedQuestions = questions.map(q => ({
    questionNumber: q.order_index + 1,
    id: (q.prep_questions as any).id,
    question_text: (q.prep_questions as any).question_text,
    options: (q.prep_questions as any).options,
  }));

  const startedAt = Date.now();
  const expiresAt = startedAt + (testData.duration_minutes * 60 * 1000);
  const sessionId = `mock_${testId}_${startedAt}`;

  // Create secure token
  const sessionToken = signSession({
    sessionId,
    testId,
    startedAt,
    expiresAt
  });

  return {
    sessionToken,
    sessionId,
    expiresAt,
    questions: formattedQuestions
  };
}

// 4. Secure Server-Side Grading
export async function submitMockTest(sessionToken: string, answers: Record<string, string>) {
  // 1. Verify token integrity
  const sessionData = verifySession(sessionToken);
  
  // 2. Enforce Expiry (allow 60 seconds grace period for network latency)
  if (Date.now() > sessionData.expiresAt + 60000) {
    console.warn("Test submitted after expiry - processing as forced auto-submit");
    // We still grade it, but we can flag it. The client should have auto-submitted.
  }

  const testId = sessionData.testId;

  // 3. Fetch Test Metadata for scoring rules
  const { data: testMeta } = await supabaseAdmin
    .from("prep_mock_tests")
    .select("negative_marking, prep_exams(title)")
    .eq("id", testId)
    .single();

  const negMarking = parseFloat(testMeta?.negative_marking || "0");

  // 4. Fetch the authoritative Answer Key and Topic Links
  const { data: answerKeyData, error: keyErr } = await supabaseAdmin
    .from("prep_mock_test_questions")
    .select(`
      order_index,
      prep_questions (
        id, correct_answer, explanation, question_text, options,
        prep_topics (id, title)
      )
    `)
    .eq("test_id", testId);

  if (keyErr || !answerKeyData) throw new Error("Failed to grade test");

  // 5. Calculate Score
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  
  const detailedResults = [];
  const topicPerformance: Record<string, { total: number, correct: number, title: string }> = {};

  for (const row of answerKeyData) {
    const q = row.prep_questions as any;
    const studentAnswer = answers[q.id];
    const isCorrect = studentAnswer === q.correct_answer;
    
    if (!studentAnswer) {
      unanswered++;
    } else if (isCorrect) {
      correct++;
    } else {
      incorrect++;
    }

    // Track Topic Performance
    if (q.prep_topics) {
      const tId = q.prep_topics.id;
      if (!topicPerformance[tId]) {
        topicPerformance[tId] = { total: 0, correct: 0, title: q.prep_topics.title };
      }
      topicPerformance[tId].total++;
      if (isCorrect) topicPerformance[tId].correct++;
    }

    detailedResults.push({
      questionId: q.id,
      questionNumber: row.order_index + 1,
      questionText: q.question_text,
      options: q.options,
      studentAnswer: studentAnswer || null,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      isCorrect: !!studentAnswer && isCorrect,
      isUnanswered: !studentAnswer,
      topicTitle: q.prep_topics?.title
    });
  }

  // Final math
  const totalQuestions = correct + incorrect + unanswered;
  // Assume 1 mark per question for this standard logic, or read from total_marks
  const totalPositive = correct * 1; 
  const totalNegative = incorrect * negMarking;
  const finalScore = totalPositive - totalNegative;
  const accuracy = (correct + incorrect > 0) ? Math.round((correct / (correct + incorrect)) * 100) : 0;

  // Format Weak Areas
  const topics = Object.entries(topicPerformance).map(([id, data]) => ({
    topicId: id,
    title: data.title,
    accuracy: Math.round((data.correct / data.total) * 100)
  }));

  // Sort topics by weakest first
  topics.sort((a, b) => a.accuracy - b.accuracy);

  return {
    summary: {
      finalScore: Math.max(0, parseFloat(finalScore.toFixed(2))),
      totalQuestions,
      correct,
      incorrect,
      unanswered,
      accuracy,
      negativePenalty: parseFloat(totalNegative.toFixed(2)),
      timeUsed: Date.now() - sessionData.startedAt
    },
    topicAnalytics: topics,
    detailedResults: detailedResults.sort((a,b) => a.questionNumber - b.questionNumber)
  };
}
