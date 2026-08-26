"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, LayoutGrid, FileText, Menu, X, Building2, GraduationCap, ClipboardList, BookOpen } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useState } from "react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [activePopup, setActivePopup] = useState<"jobs" | "updates" | null>(null);

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-[60] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="flex justify-around items-center h-16 px-2 relative">
          
          <Link href="/" onClick={() => setActivePopup(null)} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname === "/" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}>
            <Home size={20} className={pathname === "/" ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">Home</span>
          </Link>

          <button onClick={() => setActivePopup(activePopup === "jobs" ? null : "jobs")} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activePopup === "jobs" || pathname.includes("/jobs") ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}>
            <Briefcase size={20} className={activePopup === "jobs" || pathname.includes("/jobs") ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">Jobs</span>
          </button>

          <button onClick={() => setActivePopup(activePopup === "updates" ? null : "updates")} className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
            <div className={`p-2 rounded-full shadow-lg -mt-5 transition-colors ${activePopup === "updates" ? "bg-emerald-700 text-white shadow-emerald-600/40 scale-110" : "bg-emerald-600 text-white shadow-emerald-500/30 hover:bg-emerald-700"}`}>
              <LayoutGrid size={20} />
            </div>
            <span className={`text-[10px] font-bold mt-0.5 ${activePopup === "updates" ? "text-emerald-600 dark:text-emerald-400" : ""}`}>Updates</span>
          </button>

          <Link href="/tenders" onClick={() => setActivePopup(null)} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname === "/tenders" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}>
            <FileText size={20} className={pathname === "/tenders" ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">Tenders</span>
          </Link>

          <Link href="/settings" onClick={() => setActivePopup(null)} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname === "/settings" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}>
            <Menu size={20} className={pathname === "/settings" ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">More</span>
          </Link>

        </div>
      </div>

      {/* Backdrop for Popups */}
      {activePopup && (
        <div 
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActivePopup(null)}
        />
      )}

      {/* Popups (Bottom Sheets) */}
      <div 
        className={`fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ease-in-out pb-24 px-4 pt-4 border-t border-slate-200 dark:border-slate-700 lg:hidden ${
          activePopup ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4" />
        
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {activePopup === "jobs" ? "Find Jobs" : "Latest Updates"}
          </h3>
          <button 
            onClick={() => setActivePopup(null)}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {activePopup === "jobs" && (
            <>
              <Link 
                href="/govt-jobs" 
                onClick={() => setActivePopup(null)}
                className="flex flex-col items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors group"
              >
                <div className="p-3 bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 rounded-full group-hover:scale-110 transition-transform">
                  <Briefcase size={24} />
                </div>
                <span className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">Govt Jobs</span>
              </Link>
              
              <Link 
                href="/private-jobs" 
                onClick={() => setActivePopup(null)}
                className="flex flex-col items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400 rounded-full group-hover:scale-110 transition-transform">
                  <Building2 size={24} />
                </div>
                <span className="font-bold text-blue-900 dark:text-blue-100 text-sm">Private Jobs</span>
              </Link>
            </>
          )}

          {activePopup === "updates" && (
            <>
              <Link 
                href="/admissions" 
                onClick={() => setActivePopup(null)}
                className="flex flex-col items-center gap-3 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-800/50 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors group"
              >
                <div className="p-3 bg-violet-100 dark:bg-violet-800/50 text-violet-600 dark:text-violet-400 rounded-full group-hover:scale-110 transition-transform">
                  <GraduationCap size={24} />
                </div>
                <span className="font-bold text-violet-900 dark:text-violet-100 text-sm text-center">Admissions</span>
              </Link>
              
              <Link 
                href="/results" 
                onClick={() => setActivePopup(null)}
                className="flex flex-col items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800/50 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors group"
              >
                <div className="p-3 bg-orange-100 dark:bg-orange-800/50 text-orange-600 dark:text-orange-400 rounded-full group-hover:scale-110 transition-transform">
                  <ClipboardList size={24} />
                </div>
                <span className="font-bold text-orange-900 dark:text-orange-100 text-sm text-center">Exams & Results</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
