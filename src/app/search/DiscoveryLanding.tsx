
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Clock, Briefcase, GraduationCap, PenTool, BookOpen, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DiscoveryLanding() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("ajh_recent_searches") || "[]");
      setRecent(stored);
    } catch(e) {}
    
    // Auto-focus search on desktop
    if (window.innerWidth > 768) {
      inputRef.current?.focus();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Save to recent
    try {
      const updated = [query.trim(), ...recent.filter(q => q.toLowerCase() !== query.trim().toLowerCase())].slice(0, 5);
      localStorage.setItem("ajh_recent_searches", JSON.stringify(updated));
    } catch(e) {}

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleRecentClick = (q: string) => {
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-12 md:py-24 max-w-3xl flex flex-col items-center">
        
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 text-center tracking-tight">
          Search <span className="text-indigo-600 dark:text-indigo-400">AssamJobs Hub</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 text-center text-lg max-w-xl">
          Discover government jobs, competitive exams, mock tests, and practice materials all in one place.
        </p>

        {/* Massive Search Bar */}
        <form onSubmit={handleSearch} className="w-full relative mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-indigo-500" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 'Assam Police', 'ADRE', 'Teacher'..."
            className="w-full pl-14 pr-32 py-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-none text-lg md:text-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
          />
          <button 
            type="submit"
            className="absolute inset-y-2 right-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            Find <ArrowRight size={18} className="hidden md:block" />
          </button>
        </form>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Recent Searches */}
          {recent.length > 0 && (
            <div className="animate-in fade-in duration-700 delay-100 fill-mode-both">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Clock size={14} /> Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recent.map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleRecentClick(q)}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="animate-in fade-in duration-700 delay-200 fill-mode-both">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
              🔥 Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {['ADRE Grade III', 'Assam Police', 'APSC', 'TET', 'Bank Jobs', '12th Pass'].map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleRecentClick(q)}
                  className="px-4 py-2 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Explore */}
        <div className="w-full mt-16 animate-in fade-in duration-700 delay-300 fill-mode-both">
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 text-center">
              Quick Explore Categories
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/jobs" className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all group">
                <Briefcase className="h-8 w-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-800 dark:text-white text-sm">Jobs</span>
              </Link>
              <Link href="/exams" className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all group">
                <GraduationCap className="h-8 w-8 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-800 dark:text-white text-sm">Exams</span>
              </Link>
              <Link href="/exams" className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all group">
                <PenTool className="h-8 w-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-800 dark:text-white text-sm">Practice</span>
              </Link>
              <Link href="/tests" className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all group opacity-50 cursor-not-allowed" title="Coming Soon">
                <BookOpen className="h-8 w-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-800 dark:text-white text-sm">Mock Tests</span>
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
