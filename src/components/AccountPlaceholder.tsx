
"use client";

import { UserCircle } from "lucide-react";
import { useState } from "react";

export default function AccountPlaceholder() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <button 
        onClick={() => setShowTooltip(!showTooltip)}
        onBlur={() => setShowTooltip(false)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors"
        aria-label="Account Menu (Coming Soon)"
      >
        <UserCircle size={20} />
      </button>

      {/* Visual Placeholder Tooltip - strictly no auth logic */}
      {showTooltip && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">Sign In</div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Personalized job tracking and alerts are coming soon.
          </p>
          <div className="mt-2 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-1.5 rounded text-center font-bold">
            Public Access remains free
          </div>
        </div>
      )}
    </div>
  );
}
