code = """
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Plus, UploadCloud, CheckCircle, Clock, Edit, Archive, ChevronDown, Eye, X, AlertTriangle, ListChecks } from "lucide-react";
import { bulkUpdateStatusAction, updateQuestionInlineAction } from "../../actions";

export default function QuestionBankClient({ 
  initialQuestions, 
  totalCount, 
  page, 
  limit, 
  query, 
  statusFilter, 
  totalPages 
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingAction, setLoadingAction] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<any>(null);
  const [searchInput, setSearchInput] = useState(query);

  // Reset selection when page changes
  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, query, statusFilter]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        router.push("/admin/studio/questions/new");
      }
      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
      if (e.key === "Escape") {
        setPreviewQuestion(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const toggleSelectAll = () => {
    if (selectedIds.size === initialQuestions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(initialQuestions.map((q: any) => q.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set("q", searchInput);
    else params.delete("q");
    params.set("page", "1");
    router.push(`/admin/studio/questions?${params.toString()}`);
  };

  const handleFilterStatus = (s: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (s) params.set("status", s);
    else params.delete("status");
    params.set("page", "1");
    router.push(`/admin/studio/questions?${params.toString()}`);
  };

  const executeBulkAction = async (newStatus: string) => {
    if (selectedIds.size === 0) return;
    
    // Safety confirmation for destructive/mass actions
    if (!confirm(`Are you sure you want to change the status of ${selectedIds.size} questions to ${newStatus}?`)) return;

    setLoadingAction(true);
    try {
      const res = await bulkUpdateStatusAction(Array.from(selectedIds), newStatus);
      if (res.success) {
        // alert(`Successfully updated ${res.count} questions.`);
        setSelectedIds(new Set());
        router.refresh();
      } else {
        alert("Failed to update questions: " + res.error);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleInlineStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateQuestionInlineAction(id, { status: newStatus });
      router.refresh(); // Optimistic update would be better, but refresh is safer for now
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Question Bank</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Keyboard Shortcuts: <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border text-[10px]">N</kbd> New | <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border text-[10px]">ESC</kbd> Close Preview | <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border text-[10px]">/</kbd> Search
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/studio/questions/new" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-sm shadow-indigo-600/20">
            <Plus size={16} /> Add Question
          </Link>
          <Link href="/admin/studio/questions/import" className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 px-4 py-2 rounded-lg font-bold text-sm text-slate-700 dark:text-slate-300 transition">
            <UploadCloud size={16} /> Bulk Import
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col relative">
        
        {/* Bulk Action Bar (Sticky Top if selected) */}
        {selectedIds.size > 0 && (
          <div className="absolute top-0 left-0 right-0 h-16 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between px-4 z-10 rounded-t-2xl">
            <div className="flex items-center gap-3 text-indigo-800 font-bold text-sm">
              <span className="bg-indigo-200 text-indigo-900 px-2 py-1 rounded text-xs">{selectedIds.size} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button disabled={loadingAction} onClick={() => executeBulkAction("PUBLISHED")} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50">Publish</button>
              <button disabled={loadingAction} onClick={() => executeBulkAction("REVIEW")} className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 disabled:opacity-50">To Review</button>
              <button disabled={loadingAction} onClick={() => executeBulkAction("DRAFT")} className="px-3 py-1.5 bg-slate-600 text-white text-xs font-bold rounded-lg hover:bg-slate-700 disabled:opacity-50">To Draft</button>
              <button disabled={loadingAction} onClick={() => executeBulkAction("ARCHIVED")} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 disabled:opacity-50">Archive</button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className={`p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/20 ${selectedIds.size > 0 ? 'opacity-0 pointer-events-none h-16' : ''}`}>
          <form onSubmit={handleSearch} className="relative w-full sm:w-96 flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              id="search-input"
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search question text (Press /)"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-l-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 font-bold text-sm rounded-r-lg hover:bg-indigo-700">Search</button>
          </form>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {["", "DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"].map(s => {
              const isActive = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => handleFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  {s || "ALL"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selectedIds.size === initialQuestions.length && initialQuestions.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </th>
                <th className="px-4 py-3 font-bold max-w-[300px]">Question</th>
                <th className="px-4 py-3 font-bold">Metadata</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {initialQuestions.map((q: any) => (
                <tr key={q.id} className={`transition-colors group ${selectedIds.has(q.id) ? 'bg-indigo-50/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selectedIds.has(q.id)} onChange={() => toggleSelect(q.id)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900 dark:text-white line-clamp-2 text-sm">{q.question_text}</div>
                    <div className="flex gap-2 mt-1">
                      {(!q.explanation || q.explanation.trim() === '') && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded font-bold">No Exp</span>}
                      {(!q.topic_id) && <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 rounded font-bold">No Topic</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{q.prep_exams?.title || "-"}</div>
                    <div className="text-[10px] text-slate-500">{q.prep_subjects?.title || "-"} &rsaquo; {q.prep_topics?.title || "-"}</div>
                  </td>
                  <td className="px-4 py-4">
                    {/* Inline Edit Dropdown */}
                    <select 
                      value={q.status || "DRAFT"} 
                      onChange={(e) => handleInlineStatusChange(q.id, e.target.value)}
                      className={`text-xs font-bold rounded-lg border px-2 py-1 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-colors
                        ${q.status === 'PUBLISHED' ? 'text-emerald-700 border-emerald-200 bg-emerald-50' : ''}
                        ${q.status === 'REVIEW' ? 'text-amber-700 border-amber-200 bg-amber-50' : ''}
                        ${q.status === 'DRAFT' || !q.status ? 'text-slate-700 border-slate-200 bg-slate-50' : ''}
                        ${q.status === 'ARCHIVED' ? 'text-red-700 border-red-200 bg-red-50' : ''}
                      `}
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="REVIEW">REVIEW</option>
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => setPreviewQuestion(q)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors inline-flex items-center justify-center">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {initialQuestions.length === 0 && (
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
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between rounded-b-2xl">
            <div className="text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900 dark:text-white">{((page - 1) * limit) + 1}</span> to <span className="font-bold text-slate-900 dark:text-white">{Math.min(page * limit, totalCount)}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span>
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

      {/* Preview Modal/Drawer */}
      {previewQuestion && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right">
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center z-10">
              <h2 className="font-black text-lg">Question Preview</h2>
              <button onClick={() => setPreviewQuestion(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Question text</span>
                <p className="font-medium text-lg text-slate-900 mt-2">{previewQuestion.question_text}</p>
              </div>
              
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Options</span>
                {['A','B','C','D'].map(opt => (
                  <div key={opt} className={`p-3 rounded-lg border-2 ${previewQuestion.correct_answer === opt ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
                    <span className={`font-black mr-3 ${previewQuestion.correct_answer === opt ? 'text-emerald-600' : 'text-slate-400'}`}>{opt}</span>
                    <span className="font-medium">{previewQuestion.options?.[opt]}</span>
                  </div>
                ))}
              </div>

              {previewQuestion.explanation && (
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                  <span className="text-xs font-bold uppercase text-indigo-400 tracking-wider">Explanation</span>
                  <p className="text-sm text-indigo-900 mt-2">{previewQuestion.explanation}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-6">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Status</span>
                  <span className="font-bold">{previewQuestion.status || "DRAFT"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Difficulty</span>
                  <span className="font-bold">{previewQuestion.difficulty_level || "MEDIUM"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Source</span>
                  <span className="font-bold">{previewQuestion.source || "-"} {previewQuestion.year}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Topic</span>
                  <span className="font-bold">{previewQuestion.prep_topics?.title || "-"}</span>
                </div>
              </div>

              <div className="pt-6">
                 {/* Can add edit button here linking to an edit page */}
                 <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition">Edit Full Question</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"""

with open("src/app/admin/studio/questions/QuestionBankClient.tsx", "w", encoding="utf-8") as f:
    f.write(code)
