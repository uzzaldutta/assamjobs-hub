"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        <Bell size={24} />
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <h4 className="font-bold text-slate-800 dark:text-white mb-2">Notifications</h4>
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-sm text-emerald-800 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-800/50">
                <span className="font-bold">New Update!</span> Dark mode and popup navigations are now live.
              </div>
              <div className="text-center pt-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
