
"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export default function FilterDrawer({ children, totalCount }: { children: React.ReactNode, totalCount: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-full mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold py-3.5 px-4 rounded-xl flex items-center justify-between shadow-sm"
      >
        <span className="flex items-center gap-2"><SlidersHorizontal size={18} className="text-indigo-600 dark:text-indigo-400" /> Filters</span>
        <span className="text-sm font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{totalCount} Results</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      <div className={`fixed inset-y-0 right-0 w-80 max-w-full bg-white dark:bg-slate-900 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-full lg:bg-transparent lg:z-auto flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
         <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between lg:hidden">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal size={20} /> Filters
            </h3>
            <button type="button" onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
              <X size={18} />
            </button>
         </div>
         <div className="p-4 lg:p-0 flex-1 overflow-y-auto">
            {children}
         </div>
      </div>
    </>
  );
}
