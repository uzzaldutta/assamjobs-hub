
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Briefcase, 
  BookOpen, 
  Brain, 
  Bell,
  X,
  Building2,
  GraduationCap,
  FileText,
  ClipboardList,
  FolderOpen
} from "lucide-react";
import { useState } from "react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [activePopup, setActivePopup] = useState<"jobs" | "updates" | null>(null);

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 lg:hidden shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center h-full px-2">
          
          <Link href="/" onClick={() => setActivePopup(null)} className={`flex flex-col items-center justify-center w-full h-full gap-1 rounded-xl ${pathname === "/" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
            <Home size={20} className={pathname === "/" ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">Home</span>
          </Link>

          <button onClick={() => setActivePopup(activePopup === "jobs" ? null : "jobs")} className={`flex flex-col items-center justify-center w-full h-full gap-1 rounded-xl ${activePopup === "jobs" || pathname.includes("/jobs") ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
            <Briefcase size={20} className={activePopup === "jobs" || pathname.includes("/jobs") ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">Jobs</span>
          </button>

          <Link href="/exams" onClick={() => setActivePopup(null)} className={`flex flex-col items-center justify-center w-full h-full gap-1 rounded-xl ${pathname.includes("/exams") ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
             <div className={`p-2 rounded-full shadow-lg -mt-5 ${pathname.includes("/exams") ? "bg-emerald-700 text-white shadow-emerald-600/40 scale-110" : "bg-emerald-600 text-white shadow-emerald-500/30"}`}>
              <BookOpen size={20} />
            </div>
            <span className={`text-[10px] font-bold mt-0.5 ${pathname.includes("/exams") ? "text-emerald-600 dark:text-emerald-400" : ""}`}>Exams</span>
          </Link>

          <Link href="/practice" onClick={() => setActivePopup(null)} className={`flex flex-col items-center justify-center w-full h-full gap-1 rounded-xl ${pathname.includes("/practice") ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
            <Brain size={20} className={pathname.includes("/practice") ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">Practice</span>
          </Link>

          <button onClick={() => setActivePopup(activePopup === "updates" ? null : "updates")} className={`flex flex-col items-center justify-center w-full h-full gap-1 rounded-xl ${activePopup === "updates" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
            <Bell size={20} className={activePopup === "updates" ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">Updates</span>
          </button>

        </div>
      </div>

      {activePopup && (
        <div 
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActivePopup(null)}
        />
      )}

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

        {activePopup === "jobs" && (
          <div className="grid grid-cols-2 gap-3">
            <Link href="/govt-jobs" onClick={() => setActivePopup(null)} className="flex flex-col items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-colors group">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full group-hover:scale-110 transition-transform"><Briefcase size={24} /></div>
              <span className="font-bold text-emerald-900 text-sm">Govt Jobs</span>
            </Link>
            <Link href="/private-jobs" onClick={() => setActivePopup(null)} className="flex flex-col items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors group">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform"><Building2 size={24} /></div>
              <span className="font-bold text-blue-900 text-sm">Private Jobs</span>
            </Link>
          </div>
        )}

        {activePopup === "updates" && (
          <div className="grid grid-cols-3 gap-3">
            <Link href="/results" onClick={() => setActivePopup(null)} className="flex flex-col items-center gap-2 p-3 bg-indigo-50 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-colors group">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full group-hover:scale-110 transition-transform"><ClipboardList size={20} /></div>
              <span className="font-bold text-indigo-900 text-[11px] text-center">Results</span>
            </Link>
            <Link href="/admit-cards" onClick={() => setActivePopup(null)} className="flex flex-col items-center gap-2 p-3 bg-orange-50 rounded-2xl border border-orange-100 hover:bg-orange-100 transition-colors group">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-full group-hover:scale-110 transition-transform"><FileText size={20} /></div>
              <span className="font-bold text-orange-900 text-[11px] text-center">Admit Cards</span>
            </Link>
            <Link href="/admissions" onClick={() => setActivePopup(null)} className="flex flex-col items-center gap-2 p-3 bg-purple-50 rounded-2xl border border-purple-100 hover:bg-purple-100 transition-colors group">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-full group-hover:scale-110 transition-transform"><GraduationCap size={20} /></div>
              <span className="font-bold text-purple-900 text-[11px] text-center">Admissions</span>
            </Link>
            <Link href="/tenders" onClick={() => setActivePopup(null)} className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors group">
              <div className="p-2 bg-slate-200 text-slate-600 rounded-full group-hover:scale-110 transition-transform"><FolderOpen size={20} /></div>
              <span className="font-bold text-slate-700 text-[11px] text-center">Tenders</span>
            </Link>
            <Link href="/scholarships" onClick={() => setActivePopup(null)} className="flex flex-col items-center gap-2 p-3 bg-pink-50 rounded-2xl border border-pink-100 hover:bg-pink-100 transition-colors group">
              <div className="p-2 bg-pink-100 text-pink-600 rounded-full group-hover:scale-110 transition-transform"><GraduationCap size={20} /></div>
              <span className="font-bold text-pink-900 text-[11px] text-center">Scholarships</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
