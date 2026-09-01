import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import PracticeEngineClient from "./PracticeEngineClient";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: { topicId: string } }) {
  const { data: topic } = await supabase.from("prep_topics").select("title").eq("id", params.topicId).single();
  if (!topic) return { title: "Practice | AssamJobs Hub" };
  return { title: `${topic.title} Practice | AssamJobs Hub` };
}

export default async function PracticePage({ params }: { params: { topicId: string } }) {
  const { data: topic } = await supabase
    .from("prep_topics")
    .select("*, prep_chapters(title, prep_subjects(title, prep_exams(title, slug)))")
    .eq("id", params.topicId)
    .single();

  if (!topic) notFound();

  const examSlug = topic.prep_chapters?.prep_subjects?.prep_exams?.slug;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-3xl">
          <Link href={examSlug ? `/exam/${examSlug}` : "/exams"} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
            <ChevronLeft size={24} />
          </Link>
          <div className="text-center flex-1 truncate px-4">
            <h1 className="text-sm font-black text-slate-800 dark:text-white truncate uppercase tracking-wider">{topic.title}</h1>
            <p className="text-xs text-slate-500 truncate">{topic.prep_chapters?.title}</p>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <PracticeEngineClient topic={topic} />
      </main>
    </div>
  );
}