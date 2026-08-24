"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Compass, Calendar, Mic, FileText, Briefcase, Calculator, Keyboard } from "lucide-react";
import SubscribeForm from "./SubscribeForm";
import { ThemeToggle } from "./ThemeToggle";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const drawerContent = (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-white dark:bg-slate-900 h-full overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur z-10">
              <h2 className="font-bold text-lg text-slate-800 dark:text-white">Menu</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-6 pb-24">
              {/* Subscribe */}
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">Get Job Alerts</h3>
                <SubscribeForm />
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">Quick Links</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Link onClick={() => setIsOpen(false)} href="/syllabus" className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300">Syllabus & Exam Pattern</Link>
                  <Link onClick={() => setIsOpen(false)} href="/admissions" className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300">All-India Admissions</Link>
                  <Link onClick={() => setIsOpen(false)} href="/tenders" className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl font-bold text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2"><FileText size={16}/> Browse Tenders</Link>
                </div>
              </div>

              {/* AI Tools */}
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">Free AI Tools</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Link onClick={() => setIsOpen(false)} href="/tools/career-advisor" className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-semibold text-sm text-fuchsia-600 dark:text-fuchsia-400">
                    <Compass size={18} /> AI Career Advisor
                  </Link>
                  <Link onClick={() => setIsOpen(false)} href="/tools/study-planner" className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-semibold text-sm text-cyan-600 dark:text-cyan-400">
                    <Calendar size={18} /> AI Study Planner
                  </Link>
                  <Link onClick={() => setIsOpen(false)} href="/tools/interview-coach" className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-semibold text-sm text-amber-600 dark:text-amber-400">
                    <Mic size={18} /> AI Interview Coach
                  </Link>
                  <Link onClick={() => setIsOpen(false)} href="/tools/marks-calculator" className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300">
                    <Calculator size={18} className="text-slate-400" /> Marks Calculator
                  </Link>
                  <Link onClick={() => setIsOpen(false)} href="/tools/typing-test" className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300">
                    <Keyboard size={18} className="text-slate-400" /> Typing Speed Test
                  </Link>
                </div>
              </div>

              {/* App Download */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <a href="https://play.google.com/store/apps/details?id=com.ifree.assamesecalendar" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full p-4 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-bold border border-green-200 dark:border-green-800">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                  Get Calendar App
                </a>
              </div>
            </div>
          </div>
        </div>
  );

  return (
    <>
      <div className="flex items-center gap-2 lg:hidden">
        <ThemeToggle />
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          <Menu size={20} />
        </button>
      </div>

      {mounted && isOpen && createPortal(drawerContent, document.body)}
    </>
  );
}
