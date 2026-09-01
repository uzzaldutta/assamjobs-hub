"use client";

import { useState } from "react";
import { BookOpen, Layers, Target, FileQuestion, Plus, Activity } from "lucide-react";

type PrepTab = "exams" | "syllabus" | "questions" | "tests";

export default function PrepDashboard() {
  const [activeTab, setActiveTab] = useState<PrepTab>("exams");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Dashboard Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-2">Exam Preparation Hub</h2>
          <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
            Welcome to the advanced Learning Management System (LMS). Here you can build out a complete syllabus, load thousands of multiple-choice questions into the bank, and package them into competitive mock tests.
          </p>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-2 overflow-x-auto gap-2 scrollbar-hide">
        <button 
          onClick={() => setActiveTab("exams")} 
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === "exams" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
        >
          <Target size={18} /> Manage Exams
        </button>
        <button 
          onClick={() => setActiveTab("syllabus")} 
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === "syllabus" ? "bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
        >
          <Layers size={18} /> Syllabus Builder
        </button>
        <button 
          onClick={() => setActiveTab("questions")} 
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === "questions" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
        >
          <FileQuestion size={18} /> Question Bank
        </button>
        <button 
          onClick={() => setActiveTab("tests")} 
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === "tests" ? "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
        >
          <Activity size={18} /> Mock Tests
        </button>
      </div>

      {/* Content Areas */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
        
        {activeTab === "exams" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Active Exams</h3>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                <Plus size={16} /> Create Exam
              </button>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
              <Target size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 font-medium">No exams created yet. Start by creating an exam like "ADRE Grade III".</p>
            </div>
          </div>
        )}

        {activeTab === "syllabus" && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Syllabus Builder</h3>
            </div>
            <p className="text-slate-500 text-sm">Select an exam to start building its Subjects, Chapters, and Topics hierarchy.</p>
          </div>
        )}

        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Question Bank</h3>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                <Plus size={16} /> Add Question
              </button>
            </div>
            <p className="text-slate-500 text-sm">Add multiple choice questions here. You can link them to specific topics.</p>
          </div>
        )}

        {activeTab === "tests" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Mock Test Creator</h3>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
                <Plus size={16} /> Draft Test
              </button>
            </div>
            <p className="text-slate-500 text-sm">Package questions from the bank into a timed mock test.</p>
          </div>
        )}

      </div>
    </div>
  );
}
