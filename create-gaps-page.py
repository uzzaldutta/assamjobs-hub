code = """
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { AlertTriangle, Plus, Zap, CheckCircle, Database } from "lucide-react";

export const revalidate = 0;

export default async function GapsPage() {
  // Fetch all topics and count their questions
  const { data: topics, error } = await supabase
    .from("prep_topics")
    .select(`
      id, title,
      prep_chapters (id, title, prep_subjects (id, title, prep_exams (id, title))),
      prep_questions (count)
    `)
    .order("title");

  if (error) {
    return <div>Error loading gaps</div>;
  }

  // Also let's find missing explanations
  const { count: missingExplCount } = await supabase
    .from("prep_questions")
    .select("*", { count: "exact", head: true })
    .is("explanation", null);

  // Unused questions (DRAFT/REVIEW)
  const { count: unusedCount } = await supabase
    .from("prep_questions")
    .select("*", { count: "exact", head: true })
    .in("status", ["DRAFT", "REVIEW"]);

  const parsedTopics = (topics || []).map((t: any) => ({
    id: t.id,
    title: t.title,
    chapter: t.prep_chapters?.title || "Unknown",
    subject: t.prep_chapters?.prep_subjects?.title || "Unknown",
    exam: t.prep_chapters?.prep_subjects?.prep_exams?.title || "Unknown",
    count: t.prep_questions?.[0]?.count || 0
  }));

  const criticalGaps = parsedTopics.filter(t => t.count === 0);
  const highGaps = parsedTopics.filter(t => t.count > 0 && t.count < 5);
  const goodTopics = parsedTopics.filter(t => t.count >= 5);

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Content Gaps</h1>
        <p className="text-slate-500 mt-1">Identify missing questions and prioritize generation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-red-600 font-bold"><AlertTriangle size={18}/> Critical Gaps (0 Questions)</div>
          <div className="text-4xl font-black text-slate-900">{criticalGaps.length} Topics</div>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-amber-600 font-bold"><Database size={18}/> High Priority (&lt; 5 Questions)</div>
          <div className="text-4xl font-black text-slate-900">{highGaps.length} Topics</div>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold"><CheckCircle size={18}/> Healthy (5+ Questions)</div>
          <div className="text-4xl font-black text-slate-900">{goodTopics.length} Topics</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-800">Topic Action List</h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {[...criticalGaps, ...highGaps].map((topic: any) => {
            const isCritical = topic.count === 0;
            return (
              <div key={topic.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {isCritical ? 'CRITICAL' : 'HIGH'}
                    </span>
                    <span className="font-bold text-slate-900">{topic.title}</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{topic.count} Questions</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>{topic.exam}</span> &raquo; <span>{topic.subject}</span> &raquo; <span>{topic.chapter}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/studio/generator`} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 rounded font-bold text-xs transition">
                    <Zap size={14}/> Generate
                  </Link>
                  <Link href={`/admin/studio/questions/new`} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-bold text-xs transition">
                    <Plus size={14}/> Add Manually
                  </Link>
                </div>
              </div>
            );
          })}
          
          {criticalGaps.length === 0 && highGaps.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-bold">
              No content gaps found! All topics have at least 5 questions.
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-2">Quality Warnings</h3>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium text-slate-600">Missing Explanations</span>
            <span className="text-sm font-black text-amber-600 bg-amber-50 px-2 py-1 rounded">{missingExplCount}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-slate-600">Unused Drafts/Review</span>
            <span className="text-sm font-black text-slate-700 bg-slate-100 px-2 py-1 rounded">{unusedCount}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
"""
with open("src/app/admin/studio/gaps/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
