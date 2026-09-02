
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Plus, UploadCloud, Eye, FileText, BookOpen, Layers, CheckCircle, AlertTriangle, Clock, X } from "lucide-react";
import { bulkUpdateMaterialStatusAction, updateMaterialStatusAction } from "./actions";
import { supabase } from "@/lib/supabase";

export default function MaterialsClient({ 
  initialMaterials, 
  totalCount, 
  page, 
  limit, 
  query, 
  typeFilter,
  statusFilter, 
  totalPages 
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingAction, setLoadingAction] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [previewMaterial, setPreviewMaterial] = useState<any>(null);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, query, typeFilter, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.size === initialMaterials.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(initialMaterials.map((m: any) => m.id)));
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
    router.push(`/admin/studio/materials?${params.toString()}`);
  };

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/admin/studio/materials?${params.toString()}`);
  };

  const executeBulkAction = async (newStatus: string) => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to change the status of ${selectedIds.size} materials to ${newStatus}?`)) return;

    setLoadingAction(true);
    try {
      const res = await bulkUpdateMaterialStatusAction(Array.from(selectedIds), newStatus);
      if (res.success) {
        setSelectedIds(new Set());
        router.refresh();
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleInlineStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateMaterialStatusAction(id, newStatus);
      router.refresh();
    } catch (e) {
      alert("Failed to update status.");
    }
  };
  
  const getPublicUrl = (path: string) => {
    if (!path) return null;
    return supabase.storage.from("materials").getPublicUrl(path).data.publicUrl;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Materials Library</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage books, PDFs, PYQs, and practice sets.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/studio/materials/new" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-sm shadow-indigo-600/20">
            <UploadCloud size={16} /> Upload Material
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col relative">
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

        <div className={`p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/20 ${selectedIds.size > 0 ? 'opacity-0 pointer-events-none h-16' : ''}`}>
          <form onSubmit={handleSearch} className="relative w-full sm:w-96 flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by title..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-l-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 font-bold text-sm rounded-r-lg hover:bg-indigo-700">Search</button>
          </form>

          <div className="flex gap-4">
            <select value={typeFilter} onChange={e => handleFilter("type", e.target.value)} className="p-2 border border-slate-300 rounded-lg text-sm font-bold bg-white text-slate-700">
              <option value="">All Types</option>
              <option value="BOOK">Books</option>
              <option value="PDF">PDFs</option>
              <option value="PYQ">PYQs</option>
              <option value="NOTE">Notes</option>
              <option value="SYLLABUS">Syllabus</option>
              <option value="PRACTICE_SET">Practice Sets</option>
            </select>

            <select value={statusFilter} onChange={e => handleFilter("status", e.target.value)} className="p-2 border border-slate-300 rounded-lg text-sm font-bold bg-white text-slate-700">
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="REVIEW">Review</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selectedIds.size === initialMaterials.length && initialMaterials.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </th>
                <th className="px-4 py-3 font-bold max-w-[300px]">Title & Type</th>
                <th className="px-4 py-3 font-bold">Metadata</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {initialMaterials.map((m: any) => (
                <tr key={m.id} className={`transition-colors group ${selectedIds.has(m.id) ? 'bg-indigo-50/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selectedIds.has(m.id)} onChange={() => toggleSelect(m.id)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-indigo-600">
                        {m.type === 'BOOK' ? <BookOpen size={20} /> : m.type === 'PYQ' ? <Layers size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{m.title}</div>
                        <div className="text-xs text-slate-500 font-bold mt-1">{m.type} • {m.year || "No Year"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{m.prep_exams?.title || "-"}</div>
                    <div className="text-[10px] text-slate-500">{m.prep_subjects?.title || "-"}</div>
                    {!m.file_url && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">Missing File</span>}
                  </td>
                  <td className="px-4 py-4">
                    <select 
                      value={m.status || "DRAFT"} 
                      onChange={(e) => handleInlineStatusChange(m.id, e.target.value)}
                      className={`text-xs font-bold rounded-lg border px-2 py-1 bg-transparent focus:ring-2 outline-none transition-colors
                        ${m.status === 'PUBLISHED' ? 'text-emerald-700 border-emerald-200 bg-emerald-50' : ''}
                        ${m.status === 'REVIEW' ? 'text-amber-700 border-amber-200 bg-amber-50' : ''}
                        ${m.status === 'DRAFT' || !m.status ? 'text-slate-700 border-slate-200 bg-slate-50' : ''}
                        ${m.status === 'ARCHIVED' ? 'text-red-700 border-red-200 bg-red-50' : ''}
                      `}
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="REVIEW">REVIEW</option>
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => setPreviewMaterial(m)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors inline-flex items-center justify-center">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {initialMaterials.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No materials found. Try adjusting your filters.
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
                href={`/admin/studio/materials?q=${query}&type=${typeFilter}&status=${statusFilter}&page=${page > 1 ? page - 1 : 1}`}
                className={`px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold ${page <= 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                Previous
              </Link>
              <Link
                href={`/admin/studio/materials?q=${query}&type=${typeFilter}&status=${statusFilter}&page=${page < totalPages ? page + 1 : totalPages}`}
                className={`px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold ${page >= totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right">
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center z-10">
              <h2 className="font-black text-lg">Material Preview</h2>
              <button onClick={() => setPreviewMaterial(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-black tracking-wider mb-2">{previewMaterial.type}</span>
                <h3 className="font-black text-2xl text-slate-900">{previewMaterial.title}</h3>
                {previewMaterial.description && <p className="text-slate-600 mt-2 text-sm">{previewMaterial.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm border-y border-slate-100 py-6">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Status</span>
                  <span className="font-bold">{previewMaterial.status || "DRAFT"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Exam</span>
                  <span className="font-bold">{previewMaterial.prep_exams?.title || "-"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Subject</span>
                  <span className="font-bold">{previewMaterial.prep_subjects?.title || "-"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Year / Author</span>
                  <span className="font-bold">{previewMaterial.year || "-"} / {previewMaterial.author || "-"}</span>
                </div>
              </div>

              {previewMaterial.type === 'PYQ' && previewMaterial.metadata && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-black uppercase text-amber-800 tracking-wider mb-2">PYQ Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-amber-700">Shift:</span> <span className="font-bold text-amber-900">{previewMaterial.metadata.shift || "-"}</span></div>
                    <div><span className="text-amber-700">Total Marks:</span> <span className="font-bold text-amber-900">{previewMaterial.metadata.total_marks || "-"}</span></div>
                    <div><span className="text-amber-700">Duration:</span> <span className="font-bold text-amber-900">{previewMaterial.metadata.duration || "-"}</span></div>
                  </div>
                </div>
              )}

              {previewMaterial.file_url ? (
                <div className="pt-2">
                   <a 
                    href={getPublicUrl(previewMaterial.file_url) || "#"} 
                    target="_blank" rel="noreferrer"
                    className="flex justify-center w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition"
                   >
                     View / Download File
                   </a>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-2">
                  <AlertTriangle size={18} /> No file attached to this material.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
