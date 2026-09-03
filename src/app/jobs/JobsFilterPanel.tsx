
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, Search } from "lucide-react";

export default function JobsFilterPanel({ currentFilters, totalCount }: { currentFilters: any, totalCount: number }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Local state for form inputs before applying
  const [filters, setFilters] = useState(currentFilters);

  const applyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.type && filters.type !== "ALL") params.set("type", filters.type);
    if (filters.district) params.set("district", filters.district);
    if (filters.qualification) params.set("qualification", filters.qualification);
    if (filters.organization) params.set("organization", filters.organization);
    if (filters.status && filters.status !== "ALL") params.set("status", filters.status);
    if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
    
    router.push(`/jobs?${params.toString()}`);
    setIsOpen(false);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ q: "", type: "ALL", district: "", qualification: "", organization: "", status: "ALL", sort: "newest" });
    router.push("/jobs");
    setIsOpen(false);
  };

  const filterContent = (
    <form onSubmit={applyFilters} className="flex flex-col h-full bg-white dark:bg-slate-900 lg:bg-transparent rounded-2xl lg:rounded-none lg:border-none border border-slate-200 dark:border-slate-800">
      
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between lg:hidden">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal size={20} /> Filters
        </h3>
        <button type="button" onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 lg:p-0 flex-1 overflow-y-auto space-y-6">
        
        {/* Results Count (Desktop only) */}
        <div className="hidden lg:block pb-4 border-b border-slate-200 dark:border-slate-800">
           <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-1">
             <SlidersHorizontal size={20} className="text-indigo-600" /> Filters
           </h3>
           <p className="text-sm text-slate-500 font-medium">{totalCount} jobs found</p>
        </div>

        {/* Search */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Search</label>
          <div className="relative">
             <input type="text" value={filters.q} onChange={(e) => updateFilter("q", e.target.value)} placeholder="Keywords..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:border-indigo-500 outline-none transition-colors dark:text-white" />
             <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Job Type</label>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button type="button" onClick={() => updateFilter("type", "ALL")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${filters.type === "ALL" ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-600 dark:text-slate-400"}`}>All</button>
            <button type="button" onClick={() => updateFilter("type", "GOVERNMENT")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${filters.type === "GOVERNMENT" ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" : "text-slate-600 dark:text-slate-400"}`}>Govt</button>
            <button type="button" onClick={() => updateFilter("type", "PRIVATE")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${filters.type === "PRIVATE" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-600 dark:text-slate-400"}`}>Private</button>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
          <select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm focus:border-indigo-500 outline-none transition-colors dark:text-white font-medium appearance-none">
             <option value="ALL">Any Status</option>
             <option value="ACTIVE">Active & Open</option>
             <option value="CLOSING_SOON">Closing Soon (7 Days)</option>
             <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Organization */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Organization</label>
          <input type="text" value={filters.organization} onChange={(e) => updateFilter("organization", e.target.value)} placeholder="e.g., APSC, DHS..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm focus:border-indigo-500 outline-none transition-colors dark:text-white" />
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">District / Location</label>
          <input type="text" value={filters.district} onChange={(e) => updateFilter("district", e.target.value)} placeholder="e.g., Kamrup, All Assam..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm focus:border-indigo-500 outline-none transition-colors dark:text-white" />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sort By</label>
          <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm focus:border-indigo-500 outline-none transition-colors dark:text-white font-medium appearance-none">
             <option value="newest">Newest First</option>
             <option value="deadline">Deadline Soonest</option>
          </select>
        </div>
      </div>

      {/* Apply / Clear Buttons */}
      <div className="p-4 lg:p-0 lg:pt-6 border-t border-slate-200 dark:border-slate-800 lg:border-t-0 flex flex-col gap-3">
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm active:scale-95">
          Apply Filters
        </button>
        <button type="button" onClick={clearFilters} className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-colors active:scale-95">
          Clear All
        </button>
      </div>

    </form>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-full mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold py-3.5 px-4 rounded-xl flex items-center justify-between shadow-sm"
      >
        <span className="flex items-center gap-2"><SlidersHorizontal size={18} className="text-indigo-600 dark:text-indigo-400" /> Filter Jobs</span>
        <span className="text-sm font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{totalCount} Results</span>
      </button>

      {/* Mobile Slide-over Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Filter Panel (Desktop inline, Mobile slide-over) */}
      <div className={`fixed inset-y-0 right-0 w-80 max-w-full bg-white dark:bg-slate-900 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-full lg:bg-transparent lg:z-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
         {filterContent}
      </div>
    </>
  );
}
