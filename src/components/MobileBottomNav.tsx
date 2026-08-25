"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Search, BookOpen, Menu } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
      <div className="flex justify-around items-center h-16 px-2">
        
        <Link href="/" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname === "/" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}>
          <Home size={20} className={pathname === "/" ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        <Link href="/govt-jobs" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname.includes("/jobs") || pathname === "/govt-jobs" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}>
          <Briefcase size={20} className={pathname.includes("/jobs") ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
          <span className="text-[10px] font-bold">Jobs</span>
        </Link>

        <button className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
          <div className="bg-emerald-600 text-white p-2 rounded-full shadow-lg shadow-emerald-500/30 -mt-5">
            <Search size={20} />
          </div>
          <span className="text-[10px] font-bold mt-0.5">Search</span>
        </button>

        <Link href="/study-materials" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname === "/study-materials" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}>
          <BookOpen size={20} className={pathname === "/study-materials" ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
          <span className="text-[10px] font-bold">Study</span>
        </Link>

        <Link href="/settings" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname === "/settings" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}>
          <Menu size={20} className={pathname === "/settings" ? "fill-emerald-100 dark:fill-emerald-900/30" : ""} />
          <span className="text-[10px] font-bold">More</span>
        </Link>

      </div>
    </div>
  );
}
