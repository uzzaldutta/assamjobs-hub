"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import AdmitCard from "@/components/feeds/AdmitCard";
import ResultCard from "@/components/feeds/ResultCard";
import AdmissionCard from "@/components/feeds/AdmissionCard";
import { 
  Briefcase, 
  Building2, 
  Train, 
  Clock, 
  IdCard, 
  Award, 
  GraduationCap, 
  Search, 
  ArrowRight,
  Filter
} from "lucide-react";

interface UnifiedJobMatrixProps {
  govtJobs: any[];
  privateJobs: any[];
  railwayJobs: any[];
  closingSoonJobs: any[];
  recentResults: any[];
  recentAdmitCards: any[];
  recentAdmissions: any[];
}

type TabType = "GOVT" | "PRIVATE" | "RAILWAY" | "CLOSING" | "ADMITS" | "RESULTS" | "ADMISSIONS";

export default function UnifiedJobMatrix({
  govtJobs = [],
  privateJobs = [],
  railwayJobs = [],
  closingSoonJobs = [],
  recentResults = [],
  recentAdmitCards = [],
  recentAdmissions = []
}: UnifiedJobMatrixProps) {
  const [activeTab, setActiveTab] = useState<TabType>("GOVT");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { 
      id: "GOVT" as TabType, 
      label: "Govt Jobs", 
      icon: Briefcase, 
      count: govtJobs.length,
      color: "emerald",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      activeTabClass: "bg-emerald-600 text-white shadow-emerald-600/25",
      viewAllHref: "/jobs?type=GOVERNMENT" 
    },
    { 
      id: "PRIVATE" as TabType, 
      label: "Private Jobs", 
      icon: Building2, 
      count: privateJobs.length,
      color: "blue",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      activeTabClass: "bg-blue-600 text-white shadow-blue-600/25",
      viewAllHref: "/jobs?type=PRIVATE" 
    },
    { 
      id: "RAILWAY" as TabType, 
      label: "Railway (RRB)", 
      icon: Train, 
      count: railwayJobs.length,
      color: "amber",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      activeTabClass: "bg-amber-600 text-white shadow-amber-600/25",
      viewAllHref: "/jobs?type=RAILWAY" 
    },
    { 
      id: "CLOSING" as TabType, 
      label: "Closing Soon", 
      icon: Clock, 
      count: closingSoonJobs.length,
      color: "rose",
      badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      activeTabClass: "bg-rose-600 text-white shadow-rose-600/25",
      viewAllHref: "/jobs?status=CLOSING_SOON" 
    },
    { 
      id: "ADMITS" as TabType, 
      label: "Admit Cards", 
      icon: IdCard, 
      count: recentAdmitCards.length,
      color: "purple",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      activeTabClass: "bg-purple-600 text-white shadow-purple-600/25",
      viewAllHref: "/admit-cards" 
    },
    { 
      id: "RESULTS" as TabType, 
      label: "Results", 
      icon: Award, 
      count: recentResults.length,
      color: "indigo",
      badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      activeTabClass: "bg-indigo-600 text-white shadow-indigo-600/25",
      viewAllHref: "/results" 
    },
    { 
      id: "ADMISSIONS" as TabType, 
      label: "Admissions", 
      icon: GraduationCap, 
      count: recentAdmissions.length,
      color: "teal",
      badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
      activeTabClass: "bg-teal-600 text-white shadow-teal-600/25",
      viewAllHref: "/admissions" 
    }
  ];

  const currentTabConfig = tabs.find(t => t.id === activeTab) || tabs[0];

  // Get items for current tab
  const rawItems = useMemo(() => {
    switch (activeTab) {
      case "GOVT": return govtJobs;
      case "PRIVATE": return privateJobs;
      case "RAILWAY": return railwayJobs;
      case "CLOSING": return closingSoonJobs;
      case "ADMITS": return recentAdmitCards;
      case "RESULTS": return recentResults;
      case "ADMISSIONS": return recentAdmissions;
      default: return govtJobs;
    }
  }, [activeTab, govtJobs, privateJobs, railwayJobs, closingSoonJobs, recentAdmitCards, recentResults, recentAdmissions]);

  // Apply search filter within current tab
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return rawItems;
    const q = searchTerm.toLowerCase();
    return rawItems.filter(item => 
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.organization && item.organization.toLowerCase().includes(q)) ||
      (item.district && item.district.toLowerCase().includes(q)) ||
      (item.institution_name && item.institution_name.toLowerCase().includes(q)) ||
      (item.exam_name && item.exam_name.toLowerCase().includes(q))
    );
  }, [rawItems, searchTerm]);

  return (
    <section className="w-full">
      
      {/* SECTION HEADER & QUICK STATS */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            Latest Recruitment & Notifications
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Switch tabs to explore verified vacancies, admit cards, and results.
          </p>
        </div>

        <Link 
          href={currentTabConfig.viewAllHref}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 self-start sm:self-auto transition-colors"
        >
          <span>View All {currentTabConfig.label}</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* INTERACTIVE SEGMENTED TAB SWITCHER (Sticky & Horizontally Scrollable on Mobile) */}
      <div className="bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-md mb-4 sm:mb-6">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm("");
                }}
                className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive 
                    ? `${tab.activeTabClass} shadow-md` 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon size={16} strokeWidth={2.2} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER SEARCH INPUT FOR ACTIVE TAB */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Filter ${currentTabConfig.label} by title, district, or org...`}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
          />
        </div>
        
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Showing <strong>{filteredItems.length}</strong> updates
        </span>
      </div>

      {/* TAB CONTENT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        
        {/* Render Job Cards for GOVT, PRIVATE, RAILWAY, CLOSING */}
        {(activeTab === "GOVT" || activeTab === "PRIVATE" || activeTab === "RAILWAY" || activeTab === "CLOSING") && (
          filteredItems.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        )}

        {/* Render Admit Cards */}
        {activeTab === "ADMITS" && (
          filteredItems.map((adm) => (
            <AdmitCard key={adm.id} admitCard={adm} />
          ))
        )}

        {/* Render Result Cards */}
        {activeTab === "RESULTS" && (
          filteredItems.map((res) => (
            <ResultCard key={res.id} result={res} />
          ))
        )}

        {/* Render Admission Cards */}
        {activeTab === "ADMISSIONS" && (
          filteredItems.map((adm) => (
            <AdmissionCard key={adm.id} admission={adm} />
          ))
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="inline-flex p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-2">
              <Filter className="w-5 h-5" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">
              {searchTerm ? `No updates matching "${searchTerm}"` : `No ${currentTabConfig.label} updates available right now.`}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Check back soon or browse other active categories.
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM "VIEW ALL" CALLOUT */}
      {filteredItems.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href={currentTabConfig.viewAllHref}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <span>Explore All {currentTabConfig.label}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

    </section>
  );
}
