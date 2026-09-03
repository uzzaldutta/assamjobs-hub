code = """
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative w-full bg-slate-900 dark:bg-slate-950 overflow-hidden border-b border-slate-800">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none"></div>
         {/* Subtle Grid */}
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4 py-16 md:py-24">
        
        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight text-white">
          The Ultimate Platform for <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Assam Govt & Private Jobs
          </span>
        </h1>
        
        <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-8 font-medium">
          Discover verified recruitment notifications, exam results, admit cards, and free mock tests. Your career journey starts here.
        </p>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative shadow-2xl">
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search jobs, organizations, exams, or notifications..." 
            className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-3.5 pl-12 pr-28 text-base font-medium text-slate-900 dark:text-white outline-none transition-all shadow-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl transition-colors active:scale-95 shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-6 text-xs md:text-sm">
          <span className="text-slate-400 font-medium">Trending:</span>
          <Link href="/search?q=ADRE" className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded-full transition-colors font-medium border border-slate-700">ADRE</Link>
          <Link href="/search?q=APSC" className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded-full transition-colors font-medium border border-slate-700">APSC</Link>
          <Link href="/search?q=Assam+Police" className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded-full transition-colors font-medium border border-slate-700">Assam Police</Link>
          <Link href="/jobs?type=GOVERNMENT" className="text-emerald-400 hover:text-emerald-300 bg-emerald-900/30 hover:bg-emerald-900/50 px-4 py-1.5 rounded-full transition-colors font-bold border border-emerald-800/50">Govt Jobs</Link>
        </div>

      </div>
    </div>
  );
}
"""
with open("src/components/HeroSection.tsx", "w", encoding="utf-8") as f:
    f.write(code)
