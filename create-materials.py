code = """
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Search, Plus, BookOpen, FileText, FileBadge, CheckCircle, Edit } from "lucide-react";

export const revalidate = 0;

export default async function MaterialsPage({ searchParams }: { searchParams: { page?: string, type?: string } }) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const typeFilter = searchParams.type || "";

  let materials: any[] = [];
  let totalCount = 0;

  try {
    let q = supabase
      .from("prep_materials")
      .select("*, prep_exams(title)", { count: "exact" });
      
    if (typeFilter) q = q.eq("type", typeFilter);

    const { data, count, error } = await q.order("created_at", { ascending: false }).range(from, to);

    if (data) materials = data;
    if (count) totalCount = count;
  } catch (e) {}

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Study Materials & PYQs</h1>
          <p className="text-slate-500 mt-1">Manage PDFs, books, and previous year papers.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition">
          <Plus size={16} /> Add Material
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex gap-2">
            {["", "PYQ", "PDF", "BOOK", "NOTE"].map(t => (
              <Link
                key={t}
                href={`/admin/studio/materials?type=${t}`}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${typeFilter === t ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'}`}
              >
                {t || "ALL"}
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3 font-bold">Type</th>
                <th className="px-6 py-3 font-bold">Title</th>
                <th className="px-6 py-3 font-bold">Exam</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    {m.type === 'PYQ' && <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded"><FileBadge size={12}/> PYQ</span>}
                    {m.type === 'PDF' && <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded"><FileText size={12}/> PDF</span>}
                    {m.type === 'BOOK' && <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded"><BookOpen size={12}/> BOOK</span>}
                    {m.type === 'NOTE' && <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded"><FileText size={12}/> NOTE</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{m.title}</div>
                    {m.year && <div className="text-xs text-slate-500 mt-0.5">Year: {m.year}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                    {m.prep_exams?.title || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {m.status === 'PUBLISHED' ? 
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs"><CheckCircle size={12}/> Published</span> : 
                      <span className="inline-flex items-center gap-1 text-slate-500 font-bold text-xs"><Edit size={12}/> {m.status}</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 font-bold text-sm">Edit</button>
                  </td>
                </tr>
              ))}
              {materials.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No materials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"""
with open("src/app/admin/studio/materials/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
