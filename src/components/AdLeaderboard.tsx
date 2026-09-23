"use client";

import { memo } from "react";

interface AdLeaderboardProps {
  className?: string;
}

const AdLeaderboard = memo(function AdLeaderboard({ className = "" }: AdLeaderboardProps) {
  return (
    <div className={`flex justify-center items-center overflow-hidden w-full max-w-7xl mx-auto my-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 min-h-[90px] ${className}`}>
      <div className="flex flex-col items-center justify-center p-4">
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Advertisement</span>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">728x90 Leaderboard Space</span>
      </div>
    </div>
  );
});

export default AdLeaderboard;
