"use client";

import { Building2, MapPin, Users, Calendar, ChevronRight, Bookmark } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import FraudWarningBanner from "./FraudWarningBanner";
import { useLanguage } from "./LanguageContext";

interface JobProps {
  id: string;
  title: string;
  organization: string;
  type: "GOVERNMENT" | "PRIVATE" | "EXAM_UPDATE" | "TRAINING" | "TENDER" | "SCHOLARSHIP" | "ADMISSION";
  category: string;
  vacancies: string;
  district: string;
  lastDate?: string;
  officialUrl?: string;
  createdAt?: string;
}

export default function JobCard({ job }: { job: JobProps }) {
  const { t, lang } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("saved_jobs") || "[]");
    if (saved.some((j: any) => j.id === job.id)) {
      setIsSaved(true);
    }
  }, [job.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link click
    e.stopPropagation();
    
    let saved = JSON.parse(localStorage.getItem("saved_jobs") || "[]");
    
    if (isSaved) {
      saved = saved.filter((j: any) => j.id !== job.id);
      setIsSaved(false);
    } else {
      saved.push(job); // Save the entire job object so it can be rendered offline
      setIsSaved(true);
    }
    
    localStorage.setItem("saved_jobs", JSON.stringify(saved));
    // Dispatch a custom event so other components (like nav badges) can update
    window.dispatchEvent(new Event('saved_jobs_updated'));
  };
  
  const isPrivate = job.type === "PRIVATE";
  const isGovt = job.type === "GOVERNMENT";
  const isExam = job.type === "EXAM_UPDATE";
  const isTraining = job.type === "TRAINING";
  const isTender = job.type === "TENDER";

  let accentColor = "bg-slate-500";
  let tagColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";

  if (isGovt) {
    accentColor = "bg-emerald-500";
    tagColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  } else if (isPrivate) {
    accentColor = "bg-blue-500";
    tagColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  } else if (isExam) {
    accentColor = "bg-indigo-500";
    tagColor = "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
  } else if (isTraining) {
    accentColor = "bg-amber-500";
    tagColor = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  } else if (isTender) {
    accentColor = "bg-teal-500";
    tagColor = "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400";
  }
  
  return (
    <div className="glass-card rounded-xl p-4 flex flex-col gap-3 group relative overflow-hidden border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all h-full">
      {/* Accent edge line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor}`}></div>

      <div className="flex justify-between items-start gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${tagColor}`}>
              {job.type.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{job.category.replace('_', ' ')}</span>
          </div>
          <Link href={`/jobs/${job.id}`} className="text-base font-semibold leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors block before:absolute before:inset-0 before:z-0">
            {job.title}
          </Link>
        </div>
        <button 
          onClick={toggleSave}
          className={`p-2 rounded-lg transition-colors z-20 relative ${isSaved ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
          title={isSaved ? "Remove from saved" : "Save this update"}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-wrap gap-y-2 gap-x-3 mt-2 relative z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-md">
          <Building2 size={14} className="text-slate-500" />
          <span className="truncate max-w-[150px]">{job.organization}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-md">
          <MapPin size={14} className="text-slate-500" />
          <span className="truncate max-w-[100px]">{job.district}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md shadow-sm border border-emerald-100 dark:border-emerald-800/50">
          <Users size={14} className="text-emerald-600 dark:text-emerald-500" />
          <span>{job.vacancies} {t("posts")}</span>
        </div>
        {job.lastDate && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2.5 py-1 rounded-md shadow-sm border border-rose-100 dark:border-rose-800/50">
            <Calendar size={14} className="text-rose-500" />
            <span>{t("ends")}: {job.lastDate}</span>
          </div>
        )}
      </div>

      {isPrivate && <div className="relative z-10 mt-1"><FraudWarningBanner /></div>}
      
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 justify-between items-center relative z-10">
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
          {job.createdAt ? `Published: ${job.createdAt}` : 'Updated recently'}
        </span>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <Link href={`/jobs/${job.id}`} className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-4 py-2 rounded-lg transition-colors text-center flex-1 sm:flex-none">
            View Details &rarr;
          </Link>
          {job.officialUrl && (
            <a 
              href={job.officialUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`text-xs font-bold px-4 py-2 rounded-lg text-white ${accentColor} shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-center flex-1 sm:flex-none`}
            >
              {job.type === "STUDY_MATERIAL" ? "Download PDF" : "Apply / Link"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
