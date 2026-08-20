"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();
  
  return (
    <button 
      onClick={toggleLanguage}
      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mr-3"
    >
      {lang === "en" ? "EN | অসমীয়া" : "অসমীয়া | EN"}
    </button>
  );
}
