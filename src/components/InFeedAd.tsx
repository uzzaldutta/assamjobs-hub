"use client";

import AdBanner from "./AdBanner";

export default function InFeedAd() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm min-h-[250px] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative top bar like job card */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800"></div>
      
      {/* Label */}
      <span className="absolute top-2 right-3 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded">
        Sponsored
      </span>

      <div className="w-full h-full flex-1 flex items-center justify-center mt-4">
        {/* Replace with your specific In-Feed Ad Slot ID */}
        <AdBanner 
          dataAdSlot="YOUR_INFEED_SLOT_ID" 
          dataAdFormat="fluid" 
          className="w-full h-full min-h-[200px]" 
        />
      </div>
    </div>
  );
}
