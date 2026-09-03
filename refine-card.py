code = """
"use client";

import Link from "next/link";
import { Building2, MapPin, Clock, Bookmark, Users, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useBookmarks } from "@/hooks/useBookmarks";

interface JobCardProps {
  job: any;
}

export default function JobCard({ job }: JobCardProps) {
  const { t } = useLanguage();
  const { isSaved, toggleSave, isLoaded } = useBookmarks();
  
  const saved = isLoaded ? isSaved(job.id) : false;

  // Determine Deadline State
  let deadlineState = "ACTIVE";
  if (job.application_end) {
    const end = new Date(job.application_end);
    const now = new Date();
    const daysLeft = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (daysLeft < 0) deadlineState = "CLOSED";
    else if (daysLeft <= 7) deadlineState = "CLOSING_SOON";
  }

  // Determine Badge Styling
  let statusBadge = null;
  if (job.status === 'PUBLISHED' && job.tier === 1) {
    statusBadge = <span className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"><CheckCircle2 size={12}/> VERIFIED</span>;
  }

  let dateColor = "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700";
  let dateIcon = <Clock size={14} className="text-slate-400" />;
  if (deadlineState === "CLOSING_SOON") {
    dateColor = "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50";
    dateIcon = <AlertCircle size={14} className="text-amber-500" />;
  } else if (deadlineState === "CLOSED") {
    dateColor = "text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800";
    dateIcon = <XCircle size={14} className="text-slate-400" />;
  }

  return (
    <div className={`relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col group overflow-hidden ${deadlineState === 'CLOSED' ? 'opacity-70 grayscale-[30%]' : 'hover:border-indigo-300 dark:hover:border-indigo-700'}`}>
      
      {/* Invisible link covering the entire card */}
      <Link href={`/jobs/${job.id}`} className="absolute inset-0 z-0" aria-label={`View details for ${job.title}`} />
      
      {/* Top Row: Category Badge & Bookmark */}
      <div className="relative z-10 flex justify-between items-start mb-3">
        <div className="flex flex-wrap items-center gap-2 pointer-events-none">
          <span className={`text-[10px] md:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${job.job_type === 'GOVERNMENT' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-blue-700 bg-blue-50 border border-blue-200'}`}>
            {job.job_type || job.type || 'JOB'}
          </span>
          {statusBadge}
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation();
            toggleSave(job);
          }}
          className={`${saved ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'} transition-colors cursor-pointer p-1 -m-1 z-20`}
          aria-label={saved ? "Remove from saved" : "Save job"}
        >
          <Bookmark size={18} className={saved ? "fill-indigo-600 dark:fill-indigo-400" : ""} />
        </button>
      </div>

      {/* Title & Org */}
      <h3 className="relative z-10 text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1 pointer-events-none pr-4">
        {job.title}
      </h3>
      <p className="relative z-10 text-slate-600 dark:text-slate-400 font-medium text-sm mb-4 flex items-center gap-1.5 pointer-events-none">
        <Building2 size={14} className="opacity-70 shrink-0" /> <span className="truncate">{job.organization}</span>
      </p>

      {/* Grid Specs */}
      <div className="relative z-10 grid grid-cols-2 gap-3 mb-4 text-sm font-medium text-slate-600 dark:text-slate-300 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-slate-400 shrink-0" />
          <span className="truncate">{job.district || "Assam"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-slate-400 shrink-0" />
          <span className="truncate">{job.vacancies ? `${job.vacancies} Posts` : "Multiple Posts"}</span>
        </div>
      </div>

      {/* Deadline Highlight */}
      <div className={`relative z-10 px-3 py-2 rounded-lg font-bold text-xs md:text-sm mb-4 flex items-center gap-2 border pointer-events-none ${dateColor}`}>
        {dateIcon} 
        <span>
          {deadlineState === "CLOSED" ? "Closed on " : "Last Date: "}
          {job.application_end ? new Date(job.application_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Not Specified"}
        </span>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-slate-400 font-medium">
              Posted: {new Date(job.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
        </div>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Details
        </span>
      </div>

    </div>
  );
}
"""
with open("src/components/JobCard.tsx", "w", encoding="utf-8") as f:
    f.write(code)
