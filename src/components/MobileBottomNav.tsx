"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, FileText, Menu, X, Building2, ClipboardList, GraduationCap, Wrench, Settings, BookCheck } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useState } from "react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [activePopup, setActivePopup] = useState<"jobs" | "more" | null>(null);

  const handleHomeClick = (e: React.MouseEvent) => {
    setActivePopup(null);
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-[60] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="flex justify-around items-center h-16 px-2 relative">
          
          <Link href="/" onClick={handleHomeClick} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-95 rounded-xl ${pathname === "/" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
            <Home size={20} className={pathname === "/" ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">{t("nav_home")}</span>
          </Link>

          <button onClick={() => setActivePopup(activePopup === "jobs" ? null : "jobs")} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-95 rounded-xl ${activePopup === "jobs" || pathname.includes("/jobs") ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
            <Briefcase size={20} className={activePopup === "jobs" || pathname.includes("/jobs") ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">{t("nav_jobs")}</span>
          </button>

          <Link href="/results" onClick={() => setActivePopup(null)} className="flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-95 rounded-xl text-slate-500 dark:text-slate-400">
            <div className={`p-2 rounded-full shadow-lg -mt-5 transition-colors ${pathname.includes("/results") ? "bg-emerald-700 text-white shadow-emerald-600/40 scale-110" : "bg-emerald-600 text-white shadow-emerald-500/30"}`}>
              <ClipboardList size={20} />
            </div>
            <span className={`text-[10px] font-bold mt-0.5 ${pathname.includes("/results") ? "text-emerald-600 dark:text-emerald-400" : ""}`}>{t("nav_results")}</span>
          </Link>

          <Link href="/mock-tests" onClick={() => setActivePopup(null)} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-95 rounded-xl ${pathname.includes("/mock-tests") ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
            <BookCheck size={20} className={pathname.includes("/mock-tests") ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">{t("nav_mock")}</span>
          </Link>

          <button onClick={() => setActivePopup(activePopup === "more" ? null : "more")} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-95 rounded-xl ${activePopup === "more" || pathname === "/settings" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
            <Menu size={20} className={activePopup === "more" || pathname === "/settings" ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
            <span className="text-[10px] font-bold">{t("nav_more")}</span>
          </button>

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
            {activePopup === "jobs" ? "Find Jobs" : "More Options"}
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
          </div>
        )}

        {activePopup === "more" && (
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/admissions" 
              onClick={() => setActivePopup(null)}
              className="flex flex-col items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors group"
            >
              <div className="p-3 bg-purple-100 dark:bg-purple-800/50 text-purple-600 dark:text-purple-400 rounded-full group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <span className="font-bold text-purple-900 dark:text-purple-100 text-sm">Admissions</span>
            </Link>
            
            <Link 
              href="/admit-cards" 
              onClick={() => setActivePopup(null)}
              className="flex flex-col items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800/50 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors group"
            >
              <div className="p-3 bg-orange-100 dark:bg-orange-800/50 text-orange-600 dark:text-orange-400 rounded-full group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <span className="font-bold text-orange-900 dark:text-orange-100 text-sm">Admit Cards</span>
            </Link>
            
            <Link 
              href="/tools" 
              onClick={() => setActivePopup(null)}
              className="flex flex-col items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors group"
            >
              <div className="p-3 bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600 dark:text-indigo-400 rounded-full group-hover:scale-110 transition-transform">
                <Wrench size={24} />
              </div>
              <span className="font-bold text-indigo-900 dark:text-indigo-100 text-sm">AI Tools</span>
            </Link>

            <Link 
              href="/settings" 
              onClick={() => setActivePopup(null)}
              className="flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full group-hover:scale-110 transition-transform">
                <Settings size={24} />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Settings</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
