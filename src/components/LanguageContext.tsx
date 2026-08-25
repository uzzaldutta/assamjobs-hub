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
    nav_home: "Home",
    nav_govt: "Govt Jobs",
    nav_private: "Private Jobs",
    nav_tenders: "Tenders",
    nav_admit: "Admit Cards",
    nav_admits: "Admits",
    nav_results: "Results",
    nav_syllabus: "Syllabus",
    nav_mock: "Mock Tests",
    nav_tools: "Tools",
    nav_study: "Study",
    nav_admissions: "Admissions",
    nav_mock_tests: "Mock Tests",
    nav_calendar: "Calendar",
    hero_title: "Unlock Your Dream Job in Assam",
    hero_subtitle: "Get live Govt & Private job alerts, download premium study materials, and outsmart the competition with our free AI tools.",
    hero_btn_mock: "Mock Tests",
    hero_btn_ai: "AI Tools",
    recent_jobs: "Recent Job Updates",
    active_tenders: "Active Tenders",
    recent_uploads: "Recent Uploads",
    all_india_admissions: "All-India & Assam Admissions",
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
    nav_home: "হোম",
    nav_govt: "Govt Jobs",
    nav_private: "Private Jobs",
    nav_tenders: "Tenders",
    nav_admit: "Admit Cards",
    nav_admits: "এডমিট",
    nav_results: "ফলাফল",
    nav_syllabus: "Syllabus",
    nav_mock: "Mock Tests",
    nav_tools: "সঁজুলি",
    nav_study: "অধ্যয়ন",
    nav_admissions: "নামভৰ্তি",
    nav_mock_tests: "মক টেষ্ট",
    nav_calendar: "কেলেণ্ডাৰ",
    hero_title: "অসমত আপোনাৰ সপোনৰ চাকৰি আনলক কৰক",
    hero_subtitle: "চৰকাৰী আৰু ব্যক্তিগত চাকৰিৰ তৎক্ষণাৎ আপডেট পাওক, প্ৰিমিয়াম অধ্যয়ন সামগ্ৰী ডাউনলোড কৰক আৰু AI সঁজুলি ব্যৱহাৰ কৰক।",
    hero_btn_mock: "মক টেষ্ট",
    hero_btn_ai: "AI সঁজুলি",
    recent_jobs: "শেহতীয়া চাকৰিৰ আপডেট",
    active_tenders: "সক্ৰিয় টেণ্ডাৰ",
    recent_uploads: "শেহতীয়া আপল'ড",
    all_india_admissions: "সৰ্বভাৰতীয় আৰু অসমৰ নামভৰ্তি",
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
