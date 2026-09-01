
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import PracticeEngineClient from "./PracticeEngineClient";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: { topicId: string } }) {
  const { data: topic } = await supabase.from("prep_topics").select("title").eq("id", params.topicId).single();
  if (!topic) return { title: "Practice | AssamJobs Hub" };
  return { title: `${topic.title} - Practice | AssamJobs Hub` };
}

export default async function PracticePage({ params }: { params: { topicId: string } }) {
  // Fetch Topic details to know what we are practicing
  const { data: topic } = await supabase
    .from("prep_topics")
    .select("*, prep_chapters(title, prep_subjects(title, prep_exams(title, slug)))")
    .eq("id", params.topicId)
    .single();

  if (!topic) notFound();

  // Fetch Questions for this topic. 
  // We fetch published questions only.
  const { data: questions } = await supabase
    .from("prep_questions")
    .select("id, question_text, options, correct_answer, explanation, difficulty")
    .eq("topic_id", params.topicId)
    .eq("status", "PUBLISHED")
    .order("created_at", { ascending: true }); // Simple order for now

  const examSlug = topic.prep_chapters?.prep_subjects?.prep_exams?.slug;

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-md w-full">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">No Questions Yet</h2>
          <p className="text-slate-500 mb-6">Our experts are still adding questions to {topic.title}. Check back soon!</p>
          <Link href={examSlug ? `/exam/${examSlug}` : "/exams"} className="inline-flex items-center justify-center w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
            <ChevronLeft size={20} className="mr-2" /> Back to Syllabus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Minimal Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-3xl">
          <Link href={examSlug ? `/exam/${examSlug}` : "/exams"} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
            <ChevronLeft size={24} />
          </Link>
          <div className="text-center flex-1 truncate px-4">
            <h1 className="text-sm font-black text-slate-800 dark:text-white truncate uppercase tracking-wider">{topic.title}</h1>
            <p className="text-xs text-slate-500 truncate">{topic.prep_chapters?.title}</p>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <PracticeEngineClient topic={topic} questions={questions} />
      </main>
    </div>
  );
}
