"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { ChevronDown, Briefcase, GraduationCap, BookOpen, Wrench, CalendarDays, Search, FileText } from "lucide-react";

export default function DesktopNav() {
  const { t } = useLanguage();
  
  return (
    <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm text-slate-700 dark:text-slate-200">
      
      {/* Jobs Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
          <Briefcase size={16} /> Jobs <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
        </button>
        <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 translate-y-2 group-hover:translate-y-0">
          <Link href="/govt-jobs" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_govt")}</Link>
          <Link href="/private-jobs" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_private")}</Link>
          <Link href="/admissions" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_admissions")}</Link>
        </div>
      </div>

      {/* Exams Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
          <GraduationCap size={16} /> Exams <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
        </button>
        <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 translate-y-2 group-hover:translate-y-0">
          <Link href="/admit-cards" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_admit")}</Link>
          <Link href="/syllabus" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_syllabus")}</Link>
          <Link href="/mock-tests" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_mock")}</Link>
        </div>
      </div>

      {/* Results */}
      <Link href="/results" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg> {t("nav_results")}
      </Link>

      {/* Study Materials */}
      <Link href="/study-materials" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
        <BookOpen size={16} /> {t("nav_study")}
      </Link>

      {/* Tenders */}
      <Link href="/tenders" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
        <FileText size={16} /> Tenders
      </Link>

      {/* Tools Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
          <Wrench size={16} /> Tools <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
        </button>
        <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 translate-y-2 group-hover:translate-y-0">
          <Link href="/tools/career-advisor" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">AI Career Advisor</Link>
          <Link href="/tools/study-planner" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">AI Study Planner</Link>
          <Link href="/tools/cv-maker" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">CV Maker</Link>
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
          <Link href="/tools" className="block px-4 py-2.5 text-emerald-600 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">View All Tools &rarr;</Link>
        </div>
      </div>

      {/* Calendar */}
      <Link href="/calendar" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
        <CalendarDays size={16} /> Exam Calendar
      </Link>

    </nav>
  );
}
