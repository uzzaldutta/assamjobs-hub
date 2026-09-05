import React from 'react';
import Link from 'next/link';
import { Calendar, Building2, MapPin, CheckCircle2, AlertCircle, XCircle, FileText, ExternalLink, IndianRupee, GraduationCap, FileCheck } from 'lucide-react';

export default function AdmitCard({ admitCard }: { admitCard: any }) {
  // Determine Deadline State
  let deadlineState = "ACTIVE";
  if (admitCard.exam_date) {
    const end = new Date(admitCard.exam_date);
    const now = new Date();
    const daysLeft = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (daysLeft < 0) deadlineState = "CLOSED";
    else if (daysLeft <= 7) deadlineState = "CLOSING_SOON";
  }

  // Determine Badge Styling
  let statusBadge = null;
  if (admitCard.status === 'PUBLISHED' && admitCard.verification_status === 'VERIFIED') {
    statusBadge = <span className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"><CheckCircle2 size={12}/> VERIFIED</span>;
  }

  let dateColor = "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700";
  let dateIcon = <Calendar size={14} className="text-slate-400" />;
  if (deadlineState === "CLOSING_SOON") {
    dateColor = "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50";
    dateIcon = <AlertCircle size={14} className="text-amber-500" />;
  } else if (deadlineState === "CLOSED") {
    dateColor = "text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800";
    dateIcon = <XCircle size={14} className="text-slate-400" />;
  }

  return (
    <div className={`relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden ${deadlineState === 'CLOSED' ? 'opacity-80 grayscale-[15%]' : 'hover:border-cyan-300 dark:hover:border-cyan-700'}`}>
      
      {/* Top Row: Category Badge */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-cyan-700 bg-cyan-50 border border-cyan-200">
            Admit Card
          </span>
          {statusBadge}
        </div>
      </div>

      {/* Title & Org */}
      <Link href={`/admit-cards/${admitCard.id}`} className="group block mb-4">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-1 pr-4 line-clamp-2">
          {admitCard.title}
        </h3>
        {admitCard.organization && (
          <p className="text-slate-600 dark:text-slate-400 font-medium text-sm flex items-center gap-1.5">
            <Building2 size={14} className="opacity-70 shrink-0" /> <span className="truncate">{admitCard.organization}</span>
          </p>
        )}
      </Link>

      {/* Grid Specs */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm font-medium text-slate-600 dark:text-slate-300">
        
        {admitCard.exam_name && (
          <div className="flex items-center gap-1.5" title={admitCard.exam_name}>
            <FileCheck size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{admitCard.exam_name}</span>
          </div>
        )}
        {admitCard.release_date && (
          <div className="flex items-center gap-1.5" title={admitCard.release_date}>
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{admitCard.release_date}</span>
          </div>
        )}
      </div>

      {/* Deadline Highlight */}
      <div className={`px-3 py-2 rounded-lg font-bold text-xs md:text-sm mb-4 flex items-center gap-2 border ${dateColor}`}>
        {dateIcon} 
        <span>
          {deadlineState === "CLOSED" ? "Exam Passed: " : deadlineState === "CLOSING_SOON" ? "Exam Soon: " : "Exam Date: "}
          {admitCard.exam_date ? new Date(admitCard.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Not Specified"}
        </span>
      </div>

      {/* Footer & Actions */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          {admitCard.apply_url ? (
            <a href={admitCard.apply_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors flex-1 sm:flex-none">
              Download <ExternalLink size={12} />
            </a>
          ) : admitCard.official_pdf_url ? (
            <a href={admitCard.official_pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-3 rounded-lg transition-colors flex-1 sm:flex-none">
              <FileText size={12} /> Notice
            </a>
          ) : null}
        </div>
        <Link href={`/admit-cards/${admitCard.id}`} className="text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
          Details
        </Link>
      </div>

    </div>
  );
}
