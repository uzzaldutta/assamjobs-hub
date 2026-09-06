"use client";

import { useState, useMemo } from "react";
import JobCard from "@/components/JobCard";
import { Search } from "lucide-react";

export default function ScrollableJobFeed({ 
  jobs, 
  emptyMessage = "No items found.", 
  theme = 'slate' 
}: { 
  jobs: any[], 
  emptyMessage?: string, 
  theme?: 'slate' | 'amber' 
}) {
  const [search, setSearch] = useState("");
  
  const filteredJobs = useMemo(() => {
    if (!search || !jobs) return jobs || [];
    const lower = search.toLowerCase();
    return jobs.filter(j => 
      j.title?.toLowerCase().includes(lower) || 
      j.organization?.toLowerCase().includes(lower) ||
      j.district?.toLowerCase().includes(lower) ||
      j.tags?.some((t: string) => t.toLowerCase().includes(lower))
    );
  }, [jobs, search]);

  const bgClass = theme === 'amber' 
    ? 'bg-amber-50/30 dark:bg-amber-900/10 border-amber-200/60 dark:border-amber-900/40' 
    : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800';
    
  const fadeClass = theme === 'amber' 
    ? 'from-amber-50/90 dark:from-slate-900/90' 
    : 'from-slate-50/90 dark:from-slate-900/90';

  return (
    <div className={`relative rounded-2xl border ${bgClass} p-4 flex flex-col`}>
      {/* Sticky Search Filter */}
      <div className="mb-4 relative z-10">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Quick filter by title, organization, or location..." 
          className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      {/* Scrollable Grid */}
      <div className="h-[600px] overflow-y-auto custom-scroll pr-2 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
          {filteredJobs.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="inline-block p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                 <Search className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">{search ? "No jobs match your filter." : emptyMessage}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t ${fadeClass} to-transparent pointer-events-none rounded-b-2xl z-10`}></div>
    </div>
  );
}
