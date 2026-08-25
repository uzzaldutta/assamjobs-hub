"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <div className="bg-indigo-600 dark:bg-indigo-900 px-4 pt-5 pb-6 md:pt-8 md:pb-10 rounded-b-[1.5rem] md:rounded-2xl shadow-lg relative z-0 md:mt-4">
      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1.5 leading-tight">{t("hero_title")}</h2>
      <p className="text-indigo-100 text-sm md:text-base mb-4 max-w-lg">{t("hero_subtitle")}</p>
      <div className="flex flex-row flex-wrap items-center gap-2 md:gap-3">
        <Link href="/mock-tests" className="inline-flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-2 px-4 md:py-3 md:px-6 rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95 text-sm md:text-base">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          {t("hero_btn_mock")}
        </Link>
        <Link href="/tools" className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95 border border-indigo-400 text-sm md:text-base">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
          {t("hero_btn_ai")}
        </Link>
      </div>
    </div>
  );
}
