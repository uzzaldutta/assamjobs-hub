"use client";

import Link from "next/link";
import SearchAutocomplete from "./SearchAutocomplete";
import { useLanguage } from "./LanguageContext";
import { ChevronDown, Briefcase, GraduationCap, BookOpen, Wrench, CalendarDays, Search, FileText, Home, Bell } from "lucide-react";

export default function DesktopNav() {
  const { t } = useLanguage();
  
  return (
    <nav className="hidden lg:flex items-center gap-2 lg:gap-3 font-semibold text-sm text-slate-700 dark:text-slate-200">
      
      {/* Home */}
      <Link href="/" onClick={(e) => {
        if (typeof window !== 'undefined' && window.location.pathname === '/') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }} className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">
        <Home size={16} /> {t("nav_home")}
      </Link>

      {/* Jobs Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">
          <Briefcase size={16} /> {t("nav_jobs")} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
        </button>
        <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 translate-y-2 group-hover:translate-y-0">
          <Link href="/govt-jobs" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_govt")}</Link>
          <Link href="/private-jobs" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_private")}</Link>
          <Link href="/admissions" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_admissions")}</Link>
        </div>
      </div>

      {/* Exams Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">
          <GraduationCap size={16} /> {t("nav_exams")} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
        </button>
        <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 translate-y-2 group-hover:translate-y-0">
          <Link href="/admit-cards" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_admit")}</Link>
          <Link href="/results" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_results")}</Link>
        </div>
      </div>



      
      
      {/* Global Search Autocomplete */}
      <SearchAutocomplete className="w-64" />


      {/* Preparation Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">
          <BookOpen size={16} /> Preparation <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
        </button>
        <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 translate-y-2 group-hover:translate-y-0">
          <Link href="/study-materials" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">ðŸ“– {t("nav_study")}</Link>
          <Link href="/previous-papers" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">ðŸ“„ Previous Papers</Link>
          <Link href="/mock-tests" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">ðŸŽ¯ {t("nav_mock")}</Link>
          <Link href="/syllabus" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">ðŸ“‹ {t("nav_syllabus")}</Link>
        </div>
      </div>

      <Link href="/updates" className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">
        <Bell size={16} /> Updates
      </Link>
      {/* Tenders */}
      <Link href="/tenders" className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">
        <FileText size={16} /> {t("nav_tenders")}
      </Link>

      {/* Tools Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">
          <Wrench size={16} /> {t("nav_tools")} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
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
      <Link href="/calendar" className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">
        <CalendarDays size={16} /> {t("nav_calendar")}
      </Link>


      {/* Download Apps */}
      <div className="relative group ml-2">
        <button className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 border border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 rounded-full hover:shadow-lg hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300 backdrop-blur-md font-bold">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
          Get Apps
        </button>
        <div className="absolute top-full right-0 mt-3 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-3 translate-y-2 group-hover:translate-y-0">
          
          <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all group/link mb-2 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800">
            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover/link:scale-110 transition-transform shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
            </div>
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">Assam Jobs Hub</div>
              <div className="text-[11px] text-slate-500 font-normal mt-0.5">Get instant job alerts</div>
            </div>
          </a>

          <a href="https://play.google.com/store/apps/details?id=com.ifree.assamesecalendar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-xl transition-all group/link border border-transparent hover:border-orange-100 dark:hover:border-orange-800">
            <div className="bg-orange-100 dark:bg-orange-900/50 p-2.5 rounded-xl text-orange-600 dark:text-orange-400 group-hover/link:scale-110 transition-transform shadow-sm">
              <CalendarDays size={20} />
            </div>
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">Assamese Calendar</div>
              <div className="text-[11px] text-slate-500 font-normal mt-0.5">Track festivals & dates</div>
            </div>
          </a>
          
        </div>
      </div>
    </nav>

  );
}


