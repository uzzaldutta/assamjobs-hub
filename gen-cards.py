import os

cards = [
    {
        "file": "TenderCard.tsx",
        "route": "tenders",
        "prop": "tender",
        "typeColor": "amber",
        "typeLabel": "Tender",
        "titleField": "title",
        "orgField": "organization",
        "dateField": "closing_date",
        "dateLabelClosed": "Closed on ",
        "dateLabelSoon": "Closing Soon: ",
        "dateLabelActive": "Closing Date: ",
        "primaryUrl": "official_pdf_url",
        "primaryLabel": "View Tender PDF",
        "secondaryUrl": "official_source_url",
        "secondaryLabel": "Official Source",
        "meta": [
            {"label": "Tender No.", "field": "tender_number", "icon": "FileText"},
            {"label": "Value", "field": "estimated_value", "icon": "IndianRupee"},
            {"label": "Location", "field": "location", "icon": "MapPin"}
        ]
    },
    {
        "file": "AdmissionCard.tsx",
        "route": "admissions",
        "prop": "admission",
        "typeColor": "violet",
        "typeLabel": "Admission",
        "titleField": "title",
        "orgField": "institution",
        "dateField": "application_deadline",
        "dateLabelClosed": "Closed on ",
        "dateLabelSoon": "Closing Soon: ",
        "dateLabelActive": "Deadline: ",
        "primaryUrl": "apply_url",
        "primaryLabel": "Apply Now",
        "secondaryUrl": "official_pdf_url",
        "secondaryLabel": "Official Details",
        "meta": [
            {"label": "Course", "field": "course", "icon": "GraduationCap"},
            {"label": "Fee", "field": "application_fee", "icon": "IndianRupee"}
        ]
    },
    {
        "file": "ResultCard.tsx",
        "route": "results",
        "prop": "result",
        "typeColor": "pink",
        "typeLabel": "Result",
        "titleField": "title",
        "orgField": "organization",
        "dateField": "result_date",
        "dateLabelClosed": "Declared: ",
        "dateLabelSoon": "Declared: ",
        "dateLabelActive": "Declared: ",
        "primaryUrl": "official_pdf_url",
        "primaryLabel": "View Result",
        "secondaryUrl": "official_source_url",
        "secondaryLabel": "Source",
        "meta": [
            {"label": "Exam", "field": "exam_name", "icon": "FileCheck"}
        ]
    },
    {
        "file": "AdmitCard.tsx",
        "route": "admit-cards",
        "prop": "admitCard",
        "typeColor": "cyan",
        "typeLabel": "Admit Card",
        "titleField": "title",
        "orgField": "organization",
        "dateField": "exam_date",
        "dateLabelClosed": "Exam Passed: ",
        "dateLabelSoon": "Exam Soon: ",
        "dateLabelActive": "Exam Date: ",
        "primaryUrl": "apply_url",
        "primaryLabel": "Download",
        "secondaryUrl": "official_pdf_url",
        "secondaryLabel": "Notice",
        "meta": [
            {"label": "Exam", "field": "exam_name", "icon": "FileCheck"},
            {"label": "Released", "field": "release_date", "icon": "Calendar"}
        ]
    },
    {
        "file": "ScholarshipCard.tsx",
        "route": "scholarships",
        "prop": "scholarship",
        "typeColor": "fuchsia",
        "typeLabel": "Scholarship",
        "titleField": "title",
        "orgField": "provider",
        "dateField": "application_deadline",
        "dateLabelClosed": "Closed on ",
        "dateLabelSoon": "Closing Soon: ",
        "dateLabelActive": "Deadline: ",
        "primaryUrl": "apply_url",
        "primaryLabel": "Apply Now",
        "secondaryUrl": "official_pdf_url",
        "secondaryLabel": "Details",
        "meta": [
            {"label": "Amount", "field": "amount_details", "icon": "IndianRupee"}
        ]
    }
]

template = """import React from 'react';
import Link from 'next/link';
import { Calendar, Building2, MapPin, CheckCircle2, AlertCircle, XCircle, FileText, ExternalLink, IndianRupee, GraduationCap, FileCheck } from 'lucide-react';

export default function {filename}({ {prop} }: { {prop}: any }) {
  // Determine Deadline State
  let deadlineState = "ACTIVE";
  if ({prop}.{dateField}) {
    const end = new Date({prop}.{dateField});
    const now = new Date();
    const daysLeft = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (daysLeft < 0) deadlineState = "CLOSED";
    else if (daysLeft <= 7) deadlineState = "CLOSING_SOON";
  }

  // Determine Badge Styling
  let statusBadge = null;
  if ({prop}.status === 'PUBLISHED' && {prop}.verification_status === 'VERIFIED') {
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
    <div className={`relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden ${deadlineState === 'CLOSED' ? 'opacity-80 grayscale-[15%]' : 'hover:border-{typeColor}-300 dark:hover:border-{typeColor}-700'}`}>
      
      {/* Top Row: Category Badge */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-{typeColor}-700 bg-{typeColor}-50 border border-{typeColor}-200">
            {typeLabel}
          </span>
          {statusBadge}
        </div>
      </div>

      {/* Title & Org */}
      <Link href={`/{route}/${{prop}.id}`} className="group block mb-4">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-tight group-hover:text-{typeColor}-600 dark:group-hover:text-{typeColor}-400 transition-colors mb-1 pr-4 line-clamp-2">
          {{prop}.{titleField}}
        </h3>
        {{prop}.{orgField} && (
          <p className="text-slate-600 dark:text-slate-400 font-medium text-sm flex items-center gap-1.5">
            <Building2 size={14} className="opacity-70 shrink-0" /> <span className="truncate">{{prop}.{orgField}}</span>
          </p>
        )}
      </Link>

      {/* Grid Specs */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm font-medium text-slate-600 dark:text-slate-300">
        {META_BLOCK}
      </div>

      {/* Deadline Highlight */}
      <div className={`px-3 py-2 rounded-lg font-bold text-xs md:text-sm mb-4 flex items-center gap-2 border ${dateColor}`}>
        {dateIcon} 
        <span>
          {deadlineState === "CLOSED" ? "{dateLabelClosed}" : deadlineState === "CLOSING_SOON" ? "{dateLabelSoon}" : "{dateLabelActive}"}
          {{prop}.{dateField} ? new Date({prop}.{dateField}).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Not Specified"}
        </span>
      </div>

      {/* Footer & Actions */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          {{prop}.{primaryUrl} ? (
            <a href={{prop}.{primaryUrl}} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-{typeColor}-600 hover:bg-{typeColor}-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors flex-1 sm:flex-none">
              {primaryLabel} <ExternalLink size={12} />
            </a>
          ) : {prop}.{secondaryUrl} ? (
            <a href={{prop}.{secondaryUrl}} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-3 rounded-lg transition-colors flex-1 sm:flex-none">
              <FileText size={12} /> {secondaryLabel}
            </a>
          ) : null}
        </div>
        <Link href={`/{route}/${{prop}.id}`} className="text-sm font-bold text-{typeColor}-600 dark:text-{typeColor}-400 hover:underline">
          Details
        </Link>
      </div>

    </div>
  );
}
"""

for c in cards:
    filename = c["file"].replace(".tsx", "")
    
    meta_block = ""
    for m in c['meta']:
        meta_block += f"""
        {{{c['prop']}.{m['field']} && (
          <div className="flex items-center gap-1.5" title={{{c['prop']}.{m['field']}}}>
            <{m['icon']} size={{14}} className="text-slate-400 shrink-0" />
            <span className="truncate">{{{c['prop']}.{m['field']}}}</span>
          </div>
        )}}"""
        
    content = template.replace("{filename}", filename)
    content = content.replace("{prop}", c["prop"])
    content = content.replace("{route}", c["route"])
    content = content.replace("{typeColor}", c["typeColor"])
    content = content.replace("{typeLabel}", c["typeLabel"])
    content = content.replace("{titleField}", c["titleField"])
    content = content.replace("{orgField}", c["orgField"])
    content = content.replace("{dateField}", c["dateField"])
    content = content.replace("{dateLabelClosed}", c["dateLabelClosed"])
    content = content.replace("{dateLabelSoon}", c["dateLabelSoon"])
    content = content.replace("{dateLabelActive}", c["dateLabelActive"])
    content = content.replace("{primaryUrl}", c["primaryUrl"])
    content = content.replace("{primaryLabel}", c["primaryLabel"])
    content = content.replace("{secondaryUrl}", c["secondaryUrl"])
    content = content.replace("{secondaryLabel}", c["secondaryLabel"])
    content = content.replace("{META_BLOCK}", meta_block)
    
    with open(f"src/components/feeds/{c['file']}", "w", encoding="utf-8") as f:
        f.write(content)

print("Created 5 polished cards successfully.")
