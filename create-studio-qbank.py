code = """
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Search, Filter, Plus, Edit, Trash, UploadCloud, ChevronLeft, ChevronRight, CheckCircle, Clock, Archive } from "lucide-react";

export const revalidate = 0;

export default async function QuestionsPage({ searchParams }: { searchParams: { page?: string, q?: string, status?: string } }) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const query = searchParams.q || "";
  const statusFilter = searchParams.status || "";

  let questions: any[] = [];
  let totalCount = 0;

  try {
    let supabaseQuery = supabase
      .from("prep_questions")
      .select(`
        id, question_text, status, difficulty, created_at,
        prep_exams(title),
        prep_subjects(title)
      `, { count: "exact" });
      
    if (query) {
      supabaseQuery = supabaseQuery.ilike("question_text", `%${query}%`);
    }
    if (statusFilter) {
      supabaseQuery = supabaseQuery.eq("status", statusFilter);
    }

    const { data, count, error } = await supabaseQuery
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) console.error(error);
    if (data) questions = data;
    if (count) totalCount = count;
  } catch (e) {
    console.error(e);
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Question Bank</h1>
          <p className="text-slate-500 mt-1">Manage and verify questions for the practice engine.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/studio/questions/import" className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 px-4 py-2 rounded-lg font-bold text-sm text-slate-700 dark:text-slate-300 transition">
            <UploadCloud size={16} /> Bulk Import
          </Link>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-sm shadow-indigo-600/20">
            <Plus size={16} /> New Question
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <form className="relative w-full sm:w-96 flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search question text..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-l-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
            <button type="submit" className="bg-indigo-600 text-white px-4 font-bold text-sm rounded-r-lg hover:bg-indigo-700">Search</button>
          </form>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {["", "DRAFT", "REVIEW", "PUBLISHED"].map(s => {
              const isActive = statusFilter === s;
              return (
                <Link
                  key={s}
                  href={`/admin/studio/questions?q=${query}&status=${s}`}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  {s || "ALL"}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3 font-bold w-12">ID</th>
                <th className="px-6 py-3 font-bold max-w-md">Question Text</th>
                <th className="px-6 py-3 font-bold">Exam / Subject</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {questions.map((q, i) => (
                <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">
                    {from + i + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white line-clamp-2">{q.question_text}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{q.prep_exams?.title || "-"}</div>
                    <div className="text-xs text-slate-500">{q.prep_subjects?.title || "-"}</div>
                  </td>
                  <td className="px-6 py-4">
                    {q.status === 'PUBLISHED' && <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded text-xs font-bold"><CheckCircle size={12}/> Published</span>}
                    {q.status === 'REVIEW' && <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded text-xs font-bold"><Clock size={12}/> Review</span>}
                    {q.status === 'DRAFT' && <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 px-2 py-1 rounded text-xs font-bold"><Edit size={12}/> Draft</span>}
                    {q.status === 'ARCHIVED' && <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded text-xs font-bold"><Archive size={12}/> Archived</span>}
                    {!q.status && <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 px-2 py-1 rounded text-xs font-bold">Draft</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 font-medium text-sm px-2">Edit</button>
                  </td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No questions found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
            <div className="text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900 dark:text-white">{from + 1}</span> to <span className="font-bold text-slate-900 dark:text-white">{Math.min(to + 1, totalCount)}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/studio/questions?q=${query}&status=${statusFilter}&page=${page > 1 ? page - 1 : 1}`}
                className={`px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold ${page <= 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                Previous
              </Link>
              <Link
                href={`/admin/studio/questions?q=${query}&status=${statusFilter}&page=${page < totalPages ? page + 1 : totalPages}`}
                className={`px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold ${page >= totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"""

with open("src/app/admin/studio/questions/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
