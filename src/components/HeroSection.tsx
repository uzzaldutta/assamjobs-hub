"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { BookOpen, Sparkles, PencilRuler } from "lucide-react";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-5 pt-6 pb-8 md:pt-10 md:pb-12 rounded-[2rem] shadow-sm relative z-0 md:mt-6 overflow-hidden">
      
      {/* Subtle modern abstract elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-fuchsia-500"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-3 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-700 to-indigo-900 dark:from-indigo-400 dark:to-indigo-200">
          {t("hero_title")}
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg mb-8 max-w-2xl leading-relaxed font-medium">
          {t("hero_subtitle")}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          <Link href="/study-materials" className="flex items-center justify-center w-full sm:w-auto gap-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 text-sm">
            <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
            {t("nav_study")}
          </Link>

          <Link href="/tools" className="flex items-center justify-center w-full sm:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5 text-sm">
            <Sparkles size={16} className="text-emerald-300" />
            {t("hero_btn_ai")}
          </Link>

          <Link href="/mock-tests" className="flex items-center justify-center w-full sm:w-auto gap-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 text-sm">
            <PencilRuler size={16} className="text-emerald-600 dark:text-emerald-400" />
            {t("hero_btn_mock")}
          </Link>

        </div>
      </div>
    </div>
  );
}
