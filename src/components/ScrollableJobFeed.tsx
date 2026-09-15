"use client";

import { useState, useMemo, useRef, UIEvent, useEffect } from "react";
import JobCard from "@/components/JobCard";
import { Search, ChevronDown } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  
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

  // The gradient fade that covers the bottom of the list
  const fadeClass = theme === 'amber' 
    ? 'from-[#fef3c7] dark:from-[#0f172a]' 
    : 'from-white dark:from-[#0f172a]';

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
      // Is the content larger than the container?
      setIsScrollable(scrollHeight > clientHeight + 10);
      // Are we at the bottom?
      setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 20);
    }
  };

  useEffect(() => {
    // Check initially and whenever jobs list changes
    checkScroll();
    
    // Add a resize listener just in case screen size changes
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [filteredJobs]);

  const handleScroll = () => {
    checkScroll();
  };

  const scrollDown = () => {
    if (scrollRef.current) {
      // Scroll down by roughly one card height + gap (180px)
      scrollRef.current.scrollBy({ top: 300, behavior: 'smooth' });
    }
  };

  // Show button if content is scrollable AND we haven't reached the bottom yet
  const showScrollButton = isScrollable && !isAtBottom;

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
      
      {/* Boxed Scrollable Grid */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-[480px] overflow-y-auto custom-scroll pr-1 relative w-full max-w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 pb-10">
          {filteredJobs.map(job => (
            <div key={job.id} className="w-full">
              <JobCard job={job} />
            </div>
          ))}
          {filteredJobs.length === 0 && (
            <div className="w-full shrink-0 col-span-full py-16 text-center">
              <div className="inline-block p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                 <Search className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">{search ? "No jobs match your filter." : emptyMessage}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll Indicator Gradient & Beautiful Bouncing Button */}
      {showScrollButton && (
        <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${fadeClass} to-transparent pointer-events-none rounded-b-2xl z-10 flex items-end justify-center pb-5`}>
          <button 
            onClick={scrollDown}
            className="pointer-events-auto flex items-center gap-2 bg-emerald-600/95 backdrop-blur-sm text-white px-5 py-2.5 rounded-full shadow-[0_8px_30px_rgb(16,185,129,0.3)] border border-emerald-500/20 text-xs font-bold animate-bounce hover:bg-emerald-700 transition-all hover:scale-105"
          >
            Scroll for more <ChevronDown size={16} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
}
