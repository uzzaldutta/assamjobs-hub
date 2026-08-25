"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const { t } = useLanguage();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      // In a real app, route to a search page or filter the homepage
      router.push(`/?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-5 pt-6 pb-8 md:pt-10 md:pb-10 rounded-[2rem] shadow-sm relative z-0 md:mt-4 overflow-hidden">
      
      {/* Subtle modern abstract elements */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-emerald-500 to-emerald-400"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-black mb-3 leading-tight tracking-tight text-slate-900 dark:text-white">
          Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Opportunity</span> in Assam
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mb-6 max-w-2xl font-medium">
          Get live Govt & Private job alerts, download premium study materials, and outsmart the competition.
        </p>
        
        {/* Compact Search Bar */}
        <form onSubmit={handleSearch} className="w-full relative group max-w-2xl mb-5">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, exams, or organizations..." 
            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-28 text-base font-medium text-slate-800 dark:text-slate-200 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all shadow-md shadow-slate-200/50 dark:shadow-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg transition-colors shadow-sm">
            Search
          </button>
        </form>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-medium">
          <span className="text-slate-400 dark:text-slate-500">Popular:</span>
          <Link href="/?search=ADRE" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">ADRE</Link>
          <Link href="/?search=Assam+Police" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Assam Police</Link>
          <Link href="/?search=APSC" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">APSC</Link>
          <Link href="/private-jobs" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Private Jobs</Link>
        </div>

      </div>
    </div>
  );
}
