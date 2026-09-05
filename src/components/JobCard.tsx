
"use client";

import Link from "next/link";
import { Building2, MapPin, Clock, Bookmark, Users, CheckCircle2, AlertCircle, XCircle, GraduationCap, ExternalLink, FileText } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";

interface JobCardProps {
  job: any;
}

export default function JobCard({ job }: JobCardProps) {
  const { isSaved, toggleSave, isLoaded } = useBookmarks();
  const saved = isLoaded ? isSaved(job.id) : false;

  // Determine Deadline State
  let deadlineState = "ACTIVE";
  if (job.last_date) {
    const end = new Date(job.last_date);
    const now = new Date();
    const daysLeft = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (daysLeft < 0) deadlineState = "CLOSED";
    else if (daysLeft <= 7) deadlineState = "CLOSING_SOON";
  }

  // Determine Badge Styling
  let statusBadge = null;
  if (job.status === 'PUBLISHED' && job.verification_status === 'VERIFIED') {
    statusBadge = <span className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"><CheckCircle2 size={12}/> VERIFIED</span>;
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
    <div className={`relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden ${deadlineState === 'CLOSED' ? 'opacity-80 grayscale-[15%]' : 'hover:border-indigo-300 dark:hover:border-indigo-700'}`}>
      
      {/* Top Row: Category Badge & Bookmark */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[10px] md:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${job.job_type === 'GOVERNMENT' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-blue-700 bg-blue-50 border border-blue-200'}`}>
            {job.job_type || 'JOB'}
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
      <Link href={`/jobs/${job.id}`} className="group block mb-4">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1 pr-4 line-clamp-2">
          {job.title}
        </h3>
        {job.organization && (
          <p className="text-slate-600 dark:text-slate-400 font-medium text-sm flex items-center gap-1.5">
            <Building2 size={14} className="opacity-70 shrink-0" /> <span className="truncate">{job.organization}</span>
          </p>
        )}
      </Link>

      {/* Grid Specs */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm font-medium text-slate-600 dark:text-slate-300">
        {job.district && (
          <div className="flex items-center gap-1.5" title={job.district}>
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{job.district}</span>
          </div>
        )}
        {job.vacancies && (
          <div className="flex items-center gap-1.5" title={`${job.vacancies} Posts`}>
            <Users size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{job.vacancies} Posts</span>
          </div>
        )}
        {job.qualification && (
          <div className="flex items-center gap-1.5 col-span-2" title={job.qualification}>
            <GraduationCap size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{job.qualification}</span>
          </div>
        )}
      </div>

      {/* Deadline Highlight */}
      <div className={`px-3 py-2 rounded-lg font-bold text-xs md:text-sm mb-4 flex items-center gap-2 border ${dateColor}`}>
        {dateIcon} 
        <span>
          {deadlineState === "CLOSED" ? "Closed on " : deadlineState === "CLOSING_SOON" ? "Closing Soon: " : "Last Date: "}
          {job.last_date ? new Date(job.last_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Not Specified"}
        </span>
      </div>

      {/* Footer & Actions */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          {job.apply_url ? (
            <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors flex-1 sm:flex-none">
              Apply Now <ExternalLink size={12} />
            </a>
          ) : job.official_pdf_url ? (
            <a href={job.official_pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-3 rounded-lg transition-colors flex-1 sm:flex-none">
              <FileText size={12} /> Official Notification
            </a>
          ) : job.official_source_url ? (
            <a href={job.official_source_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-3 rounded-lg transition-colors flex-1 sm:flex-none">
              <FileText size={12} /> Source
            </a>
          ) : null}
        </div>
        <Link href={`/jobs/${job.id}`} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
          View Details
        </Link>
      </div>

    </div>
  );
}
