
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, ChevronLeft, BookOpen, Activity, FileText, Lock, PlayCircle, Layers, FileCheck, ArrowRight, Clock, Hash, Download } from "lucide-react";
import Link from "next/link";
import { useExamHistory } from "@/hooks/useExamHistory";

interface ExamDashboardClientProps {
  exam: any;
  subjects: any[];
  chapters: any[];
  topics: any[];
  materials: any[];
  mockTests: any[];
}

type TabType = "syllabus" | "tests" | "materials";

export default function ExamDashboardClient({ exam, subjects, chapters, topics, materials, mockTests }: ExamDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("syllabus");
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const { addExam } = useExamHistory();
  useEffect(() => {
    if (exam) {
      addExam({ id: exam.id, title: exam.title, slug: exam.slug });
    }
  }, [exam]); // intentionally omitting addExam to avoid loop, or just trust stable ref

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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full text-xs font-black tracking-wider uppercase mb-4 border border-slate-200 dark:border-slate-700">
                Official Syllabus & Practice
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
                <Layers size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
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
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${isExpanded ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                          {sIdx + 1}
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white">{subject.title}</h3>
                          <p className="text-xs font-semibold text-slate-500 mt-1">{subjectChapters.length} Chapters</p>
                        </div>
                      </div>
                      <ChevronDown size={24} className={`text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-indigo-600" : ""}`} />
                    </button>

                    {/* Chapters List */}
                    {isExpanded && (
                      <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 px-5 md:px-6 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {subjectChapters.length === 0 ? (
                          <p className="text-sm text-slate-500 py-4 text-center">No chapters mapped yet.</p>
                        ) : (
                          subjectChapters.map((chapter) => {
                            const chapterTopics = topics.filter(t => t.chapter_id === chapter.id);
                            const isChapterExpanded = expandedChapter === chapter.id;

                            return (
                              <div key={chapter.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                <button 
                                  onClick={(e) => toggleChapter(chapter.id, e)}
                                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                  <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm md:text-base flex items-center gap-2">
                                    <BookOpen size={16} className="text-indigo-500" />
                                    {chapter.title}
                                  </h4>
                                  <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                      {chapterTopics.length} Topics
                                    </span>
                                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isChapterExpanded ? "rotate-180 text-indigo-600" : ""}`} />
                                  </div>
                                </button>
                                
                                {/* Topics List */}
                                {isChapterExpanded && (
                                  <div className="p-4 pt-0 space-y-2">
                                    {chapterTopics.length === 0 ? (
                                      <p className="text-xs text-slate-500 italic px-2">No topics mapped.</p>
                                    ) : (
                                      chapterTopics.map((topic) => (
                                        <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 group hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-colors">
                                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-indigo-400" />
                                            {topic.title}
                                          </span>
                                          {/* Practice Link if available in future */}
                                          <Link href={`/practice/${topic.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                                            <PlayCircle size={14} /> Practice
                                          </Link>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ==================== TESTS TAB ==================== */}
        {activeTab === "tests" && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
             {mockTests.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <Activity size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Mock Tests Found</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">We are preparing full-length timed mock tests. This section will be activated shortly.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockTests.map((test: any) => (
                    <Link 
                      href={`/mock-tests/${test.id}`} 
                      key={test.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col group"
                    >
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {test.title}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                           <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</span>
                           <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> {test.duration_minutes || '--'} Mins</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                           <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Marks</span>
                           <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><Hash size={14} className="text-slate-400"/> {test.total_marks || '--'} Marks</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center gap-1.5"><PlayCircle size={16}/> Start Test</span>
                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors text-indigo-600 dark:text-indigo-400">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
             )}
          </div>
        )}

        {/* ==================== MATERIALS TAB ==================== */}
        {activeTab === "materials" && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
             {materials.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Study Materials Found</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">PDFs, notes, and previous year papers related to {exam.title} will appear here.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {materials.map((material: any) => (
                    <Link 
                      href={`/study-materials/${material.id}`} 
                      key={material.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-700 transition-all flex flex-col group"
                    >
                      <div className="mb-4">
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-100 dark:border-teal-800">
                          {material.type || 'Material'}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                        {material.title}
                      </h3>
                      
                      <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-teal-600 dark:text-teal-400 font-bold text-sm flex items-center gap-1.5"><Download size={16}/> View Details</span>
                        <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors text-teal-600 dark:text-teal-400">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
             )}
          </div>
        )}
      </main>
    </>
  );
}
