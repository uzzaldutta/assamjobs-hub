import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedMockTest() {
  console.log("Seeding dummy mock test for Phase 5 development...");
  
  // 1. Create a dummy Exam
  const { data: exam, error: eErr } = await supabase.from("prep_exams").insert({
    title: "Assam Police Constable (Mock Edition)",
    slug: "assam-police-constable-mock",
    description: "Dummy exam for mock test dev"
  }).select().single();
  
  if (eErr) return console.error("Exam Error:", eErr);

  // 2. Create Subjects, Chapters, Topics (For analytics)
  const { data: subject } = await supabase.from("prep_subjects").insert({
    exam_id: exam.id, title: "Mathematics"
  }).select().single();

  const { data: chapter } = await supabase.from("prep_chapters").insert({
    subject_id: subject.id, title: "Arithmetic"
  }).select().single();

  const { data: topic } = await supabase.from("prep_topics").insert({
    chapter_id: chapter.id, title: "Percentage"
  }).select().single();

  // 3. Create Questions
  const questionsToInsert = [
    {
      exam_id: exam.id, subject_id: subject.id, chapter_id: chapter.id, topic_id: topic.id,
      question_text: "What is 20% of 150?", options: { "A": "20", "B": "30", "C": "40", "D": "50" },
      correct_answer: "B", explanation: "20/100 * 150 = 30", difficulty: "EASY"
    },
    {
      exam_id: exam.id, subject_id: subject.id, chapter_id: chapter.id, topic_id: topic.id,
      question_text: "If a number is increased by 25% and then decreased by 20%, what is the net change?", options: { "A": "5% Increase", "B": "0% (No Change)", "C": "5% Decrease", "D": "10% Increase" },
      correct_answer: "B", explanation: "Let number be 100. 100 -> 125. 20% of 125 = 25. 125 - 25 = 100. No change.", difficulty: "MEDIUM"
    },
    {
      exam_id: exam.id, subject_id: subject.id, chapter_id: chapter.id, topic_id: topic.id,
      question_text: "A student needs 40% marks to pass. He gets 40 marks and fails by 40 marks. What are the maximum marks?", options: { "A": "160", "B": "200", "C": "240", "D": "300" },
      correct_answer: "B", explanation: "Passing marks = 40 + 40 = 80. So 40% of Max = 80 -> Max = 200.", difficulty: "HARD"
    }
  ];

  const { data: questions, error: qErr } = await supabase.from("prep_questions").insert(questionsToInsert).select();
  if (qErr) return console.error("Questions Error:", qErr);

  // 4. Create Mock Test
  const { data: test, error: tErr } = await supabase.from("prep_mock_tests").insert({
    exam_id: exam.id, title: "Assam Police Full Mock 1",
    duration_minutes: 60, total_marks: 3, negative_marking: 0.25,
    instructions: "Please read carefully. 1 mark per correct answer. -0.25 for incorrect.",
    status: "PUBLISHED"
  }).select().single();
  if (tErr) return console.error("Test Error:", tErr);

  // 5. Link Questions to Test
  const links = questions.map((q, idx) => ({
    test_id: test.id, question_id: q.id, order_index: idx
  }));
  const { error: lErr } = await supabase.from("prep_mock_test_questions").insert(links);
  if (lErr) return console.error("Link Error:", lErr);

  console.log("SUCCESS! Created Mock Test ID:", test.id);
}

seedMockTest();
