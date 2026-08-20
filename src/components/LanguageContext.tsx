"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "as";

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    posts: "Posts",
    ends: "Ends",
    updated_recently: "Updated recently",
    official_website: "Official Website",
    view_details: "View Details",
    search_placeholder: "Search jobs, exams, districts...",
    latest_updates: "Latest Updates",
    view_all: "View All",
    quick_links: "Quick Links",
    syllabus: "Syllabus & Exam Pattern",
    admit_cards: "Download Admit Cards",
    papers: "Previous Year Papers",
    check_results: "Check Results",
  },
  as: {
    posts: "পদ",
    ends: "অন্তিম তাৰিখ",
    updated_recently: "শেহতীয়া আপডেট",
    official_website: "চৰকাৰী ৱেবছাইট",
    view_details: "সবিশেষ চাওক",
    search_placeholder: "চাকৰি, পৰীক্ষা, জিলা বিচাৰক...",
    latest_updates: "শেহতীয়া আপডেটসমূহ",
    view_all: "সকলো চাওক",
    quick_links: "প্ৰয়োজনীয় লিংক",
    syllabus: "পাঠ্যক্ৰম আৰু পৰীক্ষাৰ আৰ্হি",
    admit_cards: "এডমিট কাৰ্ড ডাউনলোড",
    papers: "পূৰ্বৰ বৰ্ষৰ প্ৰশ্নকাকত",
    check_results: "ফলাফল চাওক",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  // Optional: load preference from localStorage if needed
  useEffect(() => {
    const saved = localStorage.getItem("app_lang");
    if (saved === "as" || saved === "en") setLang(saved);
  }, []);

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "as" : "en";
    setLang(nextLang);
    localStorage.setItem("app_lang", nextLang);
  };

  const t = (key: string) => {
    return (translations[lang] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
