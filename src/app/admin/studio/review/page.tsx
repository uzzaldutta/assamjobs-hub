
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { AlertOctagon, HelpCircle, FileWarning, Search, ChevronRight } from "lucide-react";

export const revalidate = 0;

export default async function QualityControlPage() {
  let missingExplanations = 0;
  let missingTopics = 0;
  let invalidAnswers = 0;
  let drafts = 0;

  try {
    const [
      { count: expCount },
      { count: topicCount },
      { count: invalidCount },
      { count: draftCount }
    ] = await Promise.all([
      supabase.from("prep_questions").select("id", { count: "exact", head: true }).or("explanation.is.null,explanation.eq.''"),
      supabase.from("prep_questions").select("id", { count: "exact", head: true }).is("topic_id", null),
      supabase.from("prep_questions").select("id", { count: "exact", head: true }).not("correct_answer", "in", '("A","B","C","D")'),
      supabase.from("prep_questions").select("id", { count: "exact", head: true }).eq("status", "DRAFT")
    ]);
    
    missingExplanations = expCount || 0;
    missingTopics = topicCount || 0;
    invalidAnswers = invalidCount || 0;
    drafts = draftCount || 0;
  } catch (e) {}

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Quality Control Center</h1>
        <p className="text-slate-500 mt-1">Automatically identify and resolve broken or incomplete content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-l-amber-500 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <HelpCircle size={24} className="text-amber-500" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">{missingExplanations}</span>
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Missing Explanations</h3>
          <Link href="/admin/studio/questions?filter=no_explanation" className="text-xs font-bold text-indigo-600 hover:underline flex items-center mt-2">Resolve <ChevronRight size={14}/></Link>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-l-red-500 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <AlertOctagon size={24} className="text-red-500" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">{missingTopics}</span>
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Orphaned Questions</h3>
          <p className="text-xs text-slate-500 mt-1">No assigned topic</p>
          <Link href="/admin/studio/questions?filter=no_topic" className="text-xs font-bold text-indigo-600 hover:underline flex items-center mt-2">Resolve <ChevronRight size={14}/></Link>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-l-rose-600 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <FileWarning size={24} className="text-rose-600" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">{invalidAnswers}</span>
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Invalid Format</h3>
          <p className="text-xs text-slate-500 mt-1">Answer not A,B,C,D</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-l-indigo-500 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Search size={24} className="text-indigo-500" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">{drafts}</span>
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Needs Review</h3>
          <p className="text-xs text-slate-500 mt-1">Questions in DRAFT state</p>
          <Link href="/admin/studio/questions?status=DRAFT" className="text-xs font-bold text-indigo-600 hover:underline flex items-center mt-2">Start Review <ChevronRight size={14}/></Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 mt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Duplicate Detection Engine</h2>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-800">
          <Search size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300">Run Global Duplicate Scan</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 mb-6">
            Scans the entire database using trigram similarity to find identical or highly similar questions across different exams.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg text-sm shadow-sm transition">
            Start Full Scan
          </button>
        </div>
      </div>
    </div>
  );
}
