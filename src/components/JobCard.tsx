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
    <div className="glass-card rounded-xl p-4 mb-4 flex flex-col gap-3 group relative overflow-hidden border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
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

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-1 relative z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <Building2 size={14} className="text-slate-400" />
          <span className="truncate">{job.organization}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <MapPin size={14} className="text-slate-400" />
          <span className="truncate">{job.district}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <Users size={14} className="text-slate-400" />
          <span>{job.vacancies} {t("posts")}</span>
        </div>
        {job.lastDate && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
            <Calendar size={14} />
            <span>{t("ends")}: {job.lastDate}</span>
          </div>
        )}
      </div>

      {isPrivate && <div className="relative z-10"><FraudWarningBanner /></div>}
      
      <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center relative z-10">
        <span className="text-xs text-slate-500 font-medium">
          {job.createdAt ? `Published: ${job.createdAt}` : 'Updated recently'}
        </span>
        <div className="flex gap-2 items-center">
          <Link href={`/jobs/${job.id}`} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1.5">
            View Details &rarr;
          </Link>
          {job.officialUrl && (
            <a 
              href={job.officialUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg text-white ${accentColor} hover:opacity-90 transition`}
            >
              Apply / Official Link
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
