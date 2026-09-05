
"use server";

import { createClient } from "@supabase/supabase-js";

// We use the admin client here so that even if we lock down public read access to answers in the future,
// the server actions can still validate answers securely.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getPracticeSession(id: string, type: 'topic' | 'mock' = 'topic') {
  let questionIds: string[] = [];

  if (type === 'mock') {
    // Fetch from mock test join table
    const { data, error } = await supabaseAdmin
      .from("prep_mock_test_questions")
      .select("question_id")
      .eq("test_id", id)
      .order("order_index", { ascending: true });
      
    if (error) throw new Error("Failed to load mock test questions");
    if (data) {
      questionIds = data.map(r => r.question_id);
    }
  } else {
    // Fetch from topic
    const { data, error } = await supabaseAdmin
      .from("prep_questions")
      .select("id")
      .eq("topic_id", id)
      .eq("status", "PUBLISHED");

    if (error) throw new Error("Failed to initialize session");
    if (data) {
      // Randomize array for topic practice
      questionIds = data.map(v => v.id).sort(() => 0.5 - Math.random());
    }
  }

  if (questionIds.length === 0) return { sessionId: `sess_${Date.now()}_temp`, questionIds: [] };

  return {
    sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    questionIds
  };
}

export async function getSecureQuestion(questionId: string) {
  // Fetch question WITHOUT correct_answer and explanation
  const { data, error } = await supabaseAdmin
    .from("prep_questions")
    .select("id, question_text, options, difficulty")
    .eq("id", questionId)
    .single();

  if (error || !data) throw new Error("Question not found");
  
  return data;
}

export async function checkAnswer(questionId: string, selectedAnswer: string) {
  if (!['A', 'B', 'C', 'D'].includes(selectedAnswer)) {
    throw new Error("Invalid answer format");
  }

  // Fetch the protected fields
  const { data, error } = await supabaseAdmin
    .from("prep_questions")
    .select("correct_answer, explanation")
    .eq("id", questionId)
    .single();

  if (error || !data) throw new Error("Validation failed");

  const isCorrect = data.correct_answer === selectedAnswer;

  return {
    isCorrect,
    correctAnswer: data.correct_answer,
    explanation: data.explanation || ""
  };
}
