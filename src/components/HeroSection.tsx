"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, Sparkles, GraduationCap, Briefcase, Building2, Train, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickFilters = [
    { label: "10th Pass", href: "/search?q=10th", icon: "🎓", badge: "High Demand" },
    { label: "12th Pass", href: "/search?q=12th", icon: "📜" },
    { label: "Graduate", href: "/search?q=Graduate", icon: "🏛️" },
    { label: "Assam Police", href: "/search?q=Assam+Police", icon: "👮", highlight: true },
    { label: "ADRE 2.0", href: "/search?q=ADRE", icon: "📚", highlight: true },
    { label: "APSC CCE", href: "/search?q=APSC", icon: "⚖️" },
    { label: "TET / Teaching", href: "/search?q=TET", icon: "🏫" },
    { label: "Railway (RRB)", href: "/jobs?type=RAILWAY", icon: "🚆" },
    { label: "Govt Jobs", href: "/jobs?type=GOVERNMENT", icon: "🏛️", badge: "200+ Live" },
    { label: "Private Jobs", href: "/jobs?type=PRIVATE", icon: "💼" },
  ];

  return (
    <div className="relative w-full bg-slate-900 dark:bg-slate-950 overflow-hidden border-b border-slate-800">
      
      {/* Background Ambient Glows (Subtle, High Performance) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-[90px]"></div>
         <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[90px]"></div>
         <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-3 sm:px-4 pt-4 pb-5 sm:pt-6 sm:pb-7">
        
        {/* Live Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Verified Daily Recruitment Alerts for Assam & North East</span>
        </div>

        {/* Crisp, Compact Headline */}
        <h1 className="text-xl sm:text-3xl md:text-4xl font-black mb-1.5 leading-tight tracking-tight text-white">
          Find Assam <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Govt & Private Jobs</span> Instantly
        </h1>
        
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-4 font-normal leading-relaxed">
          Official recruitment circulars, online apply links, admit cards, results, and mock tests.
        </p>

        {/* Global Fast Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative shadow-xl">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 sm:left-4 text-slate-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search by Post, Department, Police, ADRE, 10th/12th Pass..." 
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-700/60 focus:border-emerald-500 rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 pl-10 sm:pl-12 pr-24 sm:pr-28 text-xs sm:text-sm md:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all shadow-inner"
            />

            {/* Clear button if typed */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-20 sm:right-24 text-slate-400 hover:text-slate-200 p-1 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button 
              type="submit" 
              className="absolute right-1.5 sm:right-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl transition-all active:scale-95 shadow-md flex items-center gap-1.5"
            >
              Search
            </button>
          </div>
        </form>

        {/* 1-Tap Aspirant Quick Filter Pills (Horizontal Scroll on Mobile) */}
        <div className="w-full max-w-3xl mt-3.5">
          <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-2 sm:mx-0">
            <span className="text-slate-400 text-[11px] font-semibold whitespace-nowrap hidden sm:inline mr-1">
              Popular:
            </span>
            {quickFilters.map((filter, idx) => (
              <Link 
                key={idx} 
                href={filter.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  filter.highlight 
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-400' 
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/70 text-slate-300 hover:text-white'
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
                {filter.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded-full font-bold ml-0.5">
                    {filter.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
