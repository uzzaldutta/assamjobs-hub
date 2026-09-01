
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, TrendingUp, Layers } from "lucide-react";

export const revalidate = 0; // Always fresh for admin

export default async function StudioDashboard() {
  let stats = { total_questions: 0, published: 0, draft: 0, materials: 0, mocks: 0 };
  let gaps: any[] = [];
  
  try {
    // Basic stats
    const [{ count: qTotal }, { count: qPub }, { count: mat }, { count: mocks }] = await Promise.all([
      supabase.from("prep_questions").select("*", { count: "exact", head: true }),
      supabase.from("prep_questions").select("*", { count: "exact", head: true }).eq("status", "PUBLISHED"),
      supabase.from("prep_materials").select("*", { count: "exact", head: true }),
      supabase.from("prep_mock_tests").select("*", { count: "exact", head: true })
    ]);
    
    stats = {
      total_questions: qTotal || 0,
      published: qPub || 0,
      draft: (qTotal || 0) - (qPub || 0),
      materials: mat || 0,
      mocks: mocks || 0
    };

    // Get Content Gaps (topics with < 5 published questions)
    const { data: gapData } = await supabase.rpc("get_content_gaps", { p_min_questions: 5 }).limit(10);
    if (gapData) gaps = gapData;
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Content Overview</h1>
        <p className="text-slate-500 mt-1">High-level analytics of your preparation ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Questions</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.total_questions}</div>
          <div className="mt-2 text-sm text-emerald-600 font-medium">{stats.published} Published</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Drafts / Review</div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-500">{stats.draft}</div>
          <div className="mt-2 text-sm text-slate-500 font-medium">Pending approval</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Study Materials</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.materials}</div>
          <div className="mt-2 text-sm text-slate-500 font-medium">PDFs, Books, PYQs</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Mock Tests</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.mocks}</div>
          <div className="mt-2 text-sm text-slate-500 font-medium">Across all exams</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-500" /> Content Gap Analysis
            </h2>
            <p className="text-sm text-slate-500 mt-1">Topics with insufficient published questions (&lt; 5).</p>
          </div>
          <Link href="/admin/studio/review" className="text-indigo-600 font-bold text-sm hover:underline">
            View All Gaps
          </Link>
        </div>
        {gaps.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4 opacity-50" />
            <p className="font-medium text-lg">No Content Gaps Detected</p>
            <p className="text-sm mt-1">All topics have sufficient question coverage.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-3 font-bold">Exam</th>
                  <th className="px-6 py-3 font-bold">Topic</th>
                  <th className="px-6 py-3 font-bold">Published Qs</th>
                  <th className="px-6 py-3 font-bold">Draft Qs</th>
                  <th className="px-6 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {gaps.map((gap, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{gap.exam_title}</div>
                      <div className="text-xs text-slate-500">{gap.subject_title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{gap.topic_title}</div>
                      <div className="text-xs text-slate-500">{gap.chapter_title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold px-2.5 py-0.5 rounded-full text-xs">
                        {gap.published_count}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{gap.draft_count}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/studio/questions/import?topic=${gap.topic_id}`} className="text-indigo-600 hover:text-indigo-700 font-bold text-sm">
                        Import Qs
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
