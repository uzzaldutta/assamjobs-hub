"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  FileText, 
  CreditCard, 
  Award, 
  Bookmark, 
  Calendar, 
  GraduationCap, 
  CheckCircle2, 
  BrainCircuit, 
  Compass, 
  Mic 
} from 'lucide-react';
import AutoScrollTrack from './AutoScrollTrack';

export default function FeaturedToolsBlock() {
  return (
    <div className="mt-8 mb-8 space-y-6 w-full max-w-5xl mx-auto px-4 md:px-0">
      {/* General Applicant Tools */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="text-indigo-500" size={20} /> Featured Applicant Tools
        </h3>
        
        {/* Scrolling Container */}
        <AutoScrollTrack direction="left" speed={0.7}>
            <Link href="/tools/standard-form" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500 transition text-center group">
              <FileText className="mx-auto mb-2 text-indigo-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Standard Form</span>
            </Link>
            <Link href="/tools/salary-calculator" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-emerald-500 transition text-center group">
              <CreditCard className="mx-auto mb-2 text-emerald-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Salary Calculator</span>
            </Link>
            <Link href="/tools/typing-test" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-teal-500 transition text-center group">
              <Award className="mx-auto mb-2 text-teal-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Typing Test</span>
            </Link>
            <Link href="/tools/pdf-merger" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-rose-500 transition text-center group">
              <Bookmark className="mx-auto mb-2 text-rose-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">PDF Merger</span>
            </Link>
            <Link href="/tools/age-calculator" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-500 transition text-center group">
              <Calendar className="mx-auto mb-2 text-blue-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Age Calculator</span>
            </Link>
            <Link href="/tools/cgpa-converter" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-amber-500 transition text-center group">
              <GraduationCap className="mx-auto mb-2 text-amber-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">CGPA to %</span>
            </Link>
            <Link href="/tools/marks-calculator" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-violet-500 transition text-center group">
              <CheckCircle2 className="mx-auto mb-2 text-violet-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Marks Calculator</span>
            </Link>
            <Link href="/tools/fee-calculator" className="shrink-0 w-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-orange-500 transition text-center group">
              <CreditCard className="mx-auto mb-2 text-orange-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Fee Calculator</span>
              </Link>
          </AutoScrollTrack>
      </div>

      {/* AI Powered Tools Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BrainCircuit className="text-fuchsia-500" size={20} /> AI Powered Career Tools
        </h3>
        
        {/* Scrolling Container */}
        <AutoScrollTrack direction="right" speed={0.7}>
            <Link href="/tools/career-advisor" className="shrink-0 w-48 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-fuchsia-500 transition text-center group flex flex-col items-center justify-center">
              <Compass className="mx-auto mb-2 text-fuchsia-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Career Advisor</span>
            </Link>
            <Link href="/tools/study-planner" className="shrink-0 w-48 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-cyan-500 transition text-center group flex flex-col items-center justify-center">
              <Calendar className="mx-auto mb-2 text-cyan-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Study Planner</span>
            </Link>
            <Link href="/tools/interview-prep" className="shrink-0 w-48 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-amber-500 transition text-center group flex flex-col items-center justify-center">
              <Mic className="mx-auto mb-2 text-amber-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Interview Coach</span>
            </Link>
            <Link href="/mock-tests/ai-generator" className="shrink-0 w-48 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500 transition text-center group flex flex-col items-center justify-center">
              <BrainCircuit className="mx-auto mb-2 text-indigo-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Mock Test</span>
            </Link>
            <Link href="/cover-letter" className="shrink-0 w-48 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-pink-500 transition text-center group flex flex-col items-center justify-center">
              <FileText className="mx-auto mb-2 text-pink-500 group-hover:scale-110 transition" size={24} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Cover Letter</span>
            </Link>
        </AutoScrollTrack>
      </div>
    </div>
  );
}
