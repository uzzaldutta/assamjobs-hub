"use client";

import { useState } from "react";
import { CheckSquare, Square, FileText } from "lucide-react";

export default function DocumentChecklist() {
  const [checklist, setChecklist] = useState([
    { id: 'photo', label: 'Recent Passport Size Photograph', checked: false },
    { id: 'sign', label: 'Scanned Signature', checked: false },
    { id: 'edu', label: 'Educational Certificates & Marksheets', checked: false },
    { id: 'id', label: 'Valid ID Proof (Aadhaar, PAN, Voter ID)', checked: false },
    { id: 'caste', label: 'Caste / Category Certificate (if applicable)', checked: false },
    { id: 'emp', label: 'Employment Exchange Registration (if required)', checked: false },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const progress = Math.round((checklist.filter(i => i.checked).length / checklist.length) * 100);

  return (
    <div className="mt-12 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
            <FileText className="text-indigo-500" /> Standard Document Checklist
          </h3>
          <p className="text-sm text-indigo-700/70 dark:text-indigo-300/70 mt-1">Keep these documents ready before applying.</p>
        </div>
        
        {/* Progress Circle */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm">
            {progress}%
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {checklist.map((item) => (
          <button 
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
              item.checked 
                ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-sm" 
                : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600"
            }`}
          >
            {item.checked ? (
              <CheckSquare className="text-emerald-500 shrink-0" />
            ) : (
              <Square className="text-slate-400 shrink-0" />
            )}
            <span className={`text-sm font-medium ${item.checked ? 'text-slate-800 dark:text-slate-200 line-through opacity-70' : 'text-slate-700 dark:text-slate-300'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
