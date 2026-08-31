"use client";

import Link from "next/link";
import { Building2, MapPin, Calendar, Clock, Bookmark, ArrowRight, Users } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useBookmarks } from "@/hooks/useBookmarks";

interface JobCardProps {
  job: any;
}

export default function JobCard({ job }: JobCardProps) {
  const { t } = useLanguage();
  const { isSaved, toggleSave, isLoaded } = useBookmarks();
  
  const saved = isLoaded ? isSaved(job.id) : false;

  return (
    <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 md:p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col group overflow-hidden">
      
      {/* Invisible link covering the entire card */}
      <Link href={`/jobs/${job.id}`} className="absolute inset-0 z-0" aria-label={`View details for ${job.title}`} />
      
      {/* Top Row: Category Badge & Bookmark */}
      <div className="relative z-10 flex justify-between items-start mb-2 md:mb-3">
        <span className="text-[9px] md:text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-md pointer-events-none">
          {job.type}
        </span>
        <button 
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation();
            toggleSave(job);
          }}
          className={`${saved ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'} transition-colors cursor-pointer p-1 -m-1`}
          aria-label={saved ? "Remove from saved" : "Save job"}
        >
          <Bookmark size={18} className={saved ? "fill-indigo-600 dark:fill-indigo-400" : ""} />
        </button>
      </div>

      {/* Title & Org */}
      <h3 className="relative z-10 text-base md:text-xl font-bold text-slate-800 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1 pointer-events-none">
        {job.title}
      </h3>
      <p className="relative z-10 text-slate-600 dark:text-slate-400 font-medium text-xs md:text-sm mb-3 md:mb-4 flex items-center gap-1.5 pointer-events-none">
        <Building2 size={14} className="opacity-70" /> {job.organization}
      </p>

      {/* Grid Specs */}
      <div className="relative z-10 grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4 text-[11px] md:text-sm font-medium text-slate-600 dark:text-slate-300 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-slate-400" />
          <span className="truncate">{job.district || "Assam"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-slate-400" />
          <span className="truncate">{job.vacancies || "Multiple"} Posts</span>
        </div>
      </div>

      {/* Deadline Highlight */}
      <div className="relative z-10 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg font-bold text-xs md:text-sm mb-3 md:mb-4 flex items-center gap-2 border border-red-100 dark:border-red-900/50 pointer-events-none">
        <Clock size={14} /> Last Date: {job.lastDate || "TBD"}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] md:text-[11px] text-slate-400 font-medium">
          Posted: {job.createdAt}
        </span>
            <span className="text-[9px] md:text-[10px] text-slate-400/80 font-mono" title="Feed ID">
              ID: {job.id}
            </span>
          </div>
        <span className="flex items-center gap-1 text-xs md:text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 transition-colors">
          View Details <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}
