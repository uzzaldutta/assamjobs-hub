"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { BookOpen, Sparkles, PencilRuler } from "lucide-react";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-indigo-600/95 to-violet-800/95 dark:from-indigo-950/95 dark:to-violet-950/95 backdrop-blur-xl border-b border-indigo-400/20 px-4 pt-4 pb-5 md:pt-6 md:pb-8 rounded-b-[1.5rem] md:rounded-2xl shadow-xl shadow-indigo-900/10 relative z-0 md:mt-4">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-xl md:text-2xl font-black text-white mb-1.5 leading-tight tracking-tight">
          {t("hero_title")}
        </h2>
        
        <p className="text-indigo-50 dark:text-indigo-200/80 text-[13px] md:text-sm mb-4 max-w-lg leading-relaxed">
          {t("hero_subtitle")}
        </p>
        
        <div className="flex flex-row flex-wrap items-center gap-2">
          
          <Link href="/study-materials" className="inline-flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-1.5 px-3 rounded-lg shadow-sm transition-transform hover:scale-105 active:scale-95 text-[11px] md:text-xs uppercase tracking-wider">
            <BookOpen size={13} strokeWidth={2.5} />
            {t("nav_study")}
          </Link>

          <Link href="/tools" className="inline-flex items-center gap-1.5 bg-indigo-500/40 hover:bg-indigo-500/60 text-white font-bold py-1.5 px-3 rounded-lg shadow-sm transition-transform hover:scale-105 active:scale-95 border border-indigo-300/30 text-[11px] md:text-xs uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={13} strokeWidth={2.5} className="text-fuchsia-300" />
            {t("hero_btn_ai")}
          </Link>

          <Link href="/mock-tests" className="inline-flex items-center gap-1.5 bg-indigo-500/40 hover:bg-indigo-500/60 text-white font-bold py-1.5 px-3 rounded-lg shadow-sm transition-transform hover:scale-105 active:scale-95 border border-indigo-300/30 text-[11px] md:text-xs uppercase tracking-wider backdrop-blur-md">
            <PencilRuler size={13} strokeWidth={2.5} className="text-amber-300" />
            {t("hero_btn_mock")}
          </Link>

        </div>
      </div>
    </div>
  );
}
