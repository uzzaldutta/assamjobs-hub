
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, ChevronLeft, BookOpen, Activity, FileText, Lock, PlayCircle, Layers } from "lucide-react";
import Link from "next/link";

interface ExamDashboardClientProps {
  exam: any;
  subjects: any[];
  chapters: any[];
  topics: any[];
}

type TabType = "syllabus" | "tests" | "materials";

export default function ExamDashboardClient({ exam, subjects, chapters, topics }: ExamDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("syllabus");
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  // Local-First Memory: Save to recently viewed
  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem("recentExams") || "[]");
      const filtered = recent.filter((e: any) => e.id !== exam.id);
      filtered.unshift({ id: exam.id, title: exam.title, slug: exam.slug, viewedAt: new Date().toISOString() });
      localStorage.setItem("recentExams", JSON.stringify(filtered.slice(0, 5)));
    } catch (e) {}
  }, [exam]);

  const toggleSubject = (id: string) => {
    setExpandedSubject(expandedSubject === id ? null : id);
    setExpandedChapter(null); // Reset chapter when switching subject
  };

  const toggleChapter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  return (
    <>
      {/* Premium Hero Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-0 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/exams" className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-6 hover:underline">
            <ChevronLeft size={16} className="mr-1" /> Back to all exams
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-black tracking-wider uppercase mb-4 border border-indigo-100 dark:border-indigo-800">
                Official Syllabus
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-3">
                {exam.title}
              </h1>
              {exam.description && (
                <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
                  {exam.description}
                </p>
              )}
            </div>
          </div>

          {/* Clean, Modern Tabs */}
          <div className="flex gap-6 overflow-x-auto scrollbar-hide border-b border-transparent">
            <button 
              onClick={() => setActiveTab("syllabus")}
              className={`pb-4 px-2 text-sm md:text-base font-bold whitespace-nowrap border-b-4 transition-colors flex items-center gap-2 ${activeTab === "syllabus" ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
            >
              <BookOpen size={18} /> Complete Syllabus
            </button>
            <button 
              onClick={() => setActiveTab("tests")}
              className={`pb-4 px-2 text-sm md:text-base font-bold whitespace-nowrap border-b-4 transition-colors flex items-center gap-2 ${activeTab === "tests" ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
            >
              <Activity size={18} /> Mock Tests
            </button>
            <button 
              onClick={() => setActiveTab("materials")}
              className={`pb-4 px-2 text-sm md:text-base font-bold whitespace-nowrap border-b-4 transition-colors flex items-center gap-2 ${activeTab === "materials" ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
            >
              <FileText size={18} /> Study Materials
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 mt-8 max-w-4xl">
        
        {/* ==================== SYLLABUS TAB ==================== */}
        {activeTab === "syllabus" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {subjects.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <Layers size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Syllabus Not Available Yet</h3>
                <p className="text-slate-500">Our experts are currently compiling the syllabus for {exam.title}.</p>
              </div>
            ) : (
              subjects.map((subject, sIdx) => {
                const subjectChapters = chapters.filter(c => c.subject_id === subject.id);
                const isExpanded = expandedSubject === subject.id;
                
                return (
                  <div key={subject.id} className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? "border-indigo-300 dark:border-indigo-700 shadow-md" : "border-slate-200 dark:border-slate-800 hover:border-slate-300"}`}>
                    
                    {/* Subject Header */}
                    <button 
                      onClick={() => toggleSubject(subject.id)}
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${isExpanded ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                          {sIdx + 1}
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white">{subject.title}</h3>
                          <p className="text-xs font-semibold text-slate-500 mt-1">{subjectChapters.length} Chapters</p>
                        </div>
                      </div>
                      <ChevronDown size={24} className={`text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-indigo-600" : ""}`} />
                    </button>

                    {/* Chapters Accordion */}
                    <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <div className="p-2 md:p-4 pt-0 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                          {subjectChapters.length === 0 ? (
                            <p className="p-4 text-sm text-slate-500 text-center">No chapters mapped yet.</p>
                          ) : (
                            <div className="space-y-2 mt-2">
                              {subjectChapters.map((chapter) => {
                                const chapterTopics = topics.filter(t => t.chapter_id === chapter.id);
                                const isChapExpanded = expandedChapter === chapter.id;

                                return (
                                  <div key={chapter.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <button 
                                      onClick={(e) => toggleChapter(chapter.id, e)}
                                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-indigo-200 dark:bg-indigo-900 rounded-full"></div>
                                        <h4 className="font-bold text-slate-700 dark:text-slate-200">{chapter.title}</h4>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">{chapterTopics.length} Topics</span>
                                        <ChevronRight size={18} className={`text-slate-400 transition-transform ${isChapExpanded ? "rotate-90" : ""}`} />
                                      </div>
                                    </button>
                                    
                                    {/* Topics List */}
                                    {isChapExpanded && (
                                      <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 p-2 md:p-4">
                                        {chapterTopics.length === 0 ? (
                                          <p className="text-xs text-slate-500 text-center p-2">No topics mapped.</p>
                                        ) : (
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {chapterTopics.map(topic => (
                                              <div key={topic.id} className="group flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors cursor-pointer shadow-sm hover:shadow">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 flex-shrink-0"></div>
                                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{topic.title}</span>
                                                </div>
                                                <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 bg-slate-100 dark:bg-slate-900 px-2 py-1.5 rounded-md transition-colors">
                                                  <Lock size={12} /> Practice
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ==================== MOCK TESTS TAB ==================== */}
        {activeTab === "tests" && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4">
            <Activity size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Mock Tests Coming Soon</h3>
            <p className="text-slate-500 max-w-sm mx-auto">We are preparing full-length timed mock tests. This section will be activated in a later phase.</p>
          </div>
        )}

        {/* ==================== MATERIALS TAB ==================== */}
        {activeTab === "materials" && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Study Materials</h3>
            <p className="text-slate-500 max-w-sm mx-auto">PDFs, notes, and previous year papers related to {exam.title} will appear here.</p>
          </div>
        )}
      </main>
    </>
  );
}
