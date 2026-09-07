import os

routes = [
    {
        "table": "tenders",
        "route": "tenders",
        "typeColor": "amber",
        "titleField": "title",
        "orgField": "organization",
        "dateField": "closing_date",
        "dateLabel": "Closing Date",
        "primaryUrl": "official_pdf_url",
        "secondaryUrl": "official_source_url",
        "primaryLabel": "View Tender PDF",
        "meta": [
            {"label": "Tender Number", "field": "tender_number", "icon": "FileText"},
            {"label": "Estimated Value", "field": "estimated_value", "icon": "IndianRupee"},
            {"label": "Location", "field": "location", "icon": "MapPin"}
        ]
    },
    {
        "table": "admissions",
        "route": "admissions",
        "typeColor": "violet",
        "titleField": "title",
        "orgField": "institution",
        "dateField": "application_deadline",
        "dateLabel": "Application Deadline",
        "primaryUrl": "apply_url",
        "secondaryUrl": "official_pdf_url",
        "primaryLabel": "Apply Now",
        "meta": [
            {"label": "Course / Program", "field": "course", "icon": "GraduationCap"},
            {"label": "Eligibility", "field": "eligibility", "icon": "CheckCircle2"},
            {"label": "Application Fee", "field": "application_fee", "icon": "IndianRupee"}
        ]
    },
    {
        "table": "results",
        "route": "results",
        "typeColor": "pink",
        "titleField": "title",
        "orgField": "organization",
        "dateField": "result_date",
        "dateLabel": "Result Declared On",
        "primaryUrl": "official_pdf_url",
        "secondaryUrl": "official_source_url",
        "primaryLabel": "View Result PDF",
        "meta": [
            {"label": "Exam Name", "field": "exam_name", "icon": "FileCheck"}
        ]
    },
    {
        "table": "admit_cards",
        "route": "admit-cards",
        "typeColor": "cyan",
        "titleField": "title",
        "orgField": "organization",
        "dateField": "exam_date",
        "dateLabel": "Exam Date",
        "primaryUrl": "apply_url",
        "secondaryUrl": "official_pdf_url",
        "primaryLabel": "Download Admit Card",
        "meta": [
            {"label": "Exam Name", "field": "exam_name", "icon": "FileCheck"},
            {"label": "Release Date", "field": "release_date", "icon": "Calendar"}
        ]
    },
    {
        "table": "scholarships",
        "route": "scholarships",
        "typeColor": "fuchsia",
        "titleField": "title",
        "orgField": "provider",
        "dateField": "application_deadline",
        "dateLabel": "Application Deadline",
        "primaryUrl": "apply_url",
        "secondaryUrl": "official_pdf_url",
        "primaryLabel": "Apply Now",
        "meta": [
            {"label": "Eligibility", "field": "eligibility", "icon": "CheckCircle2"},
            {"label": "Amount / Benefits", "field": "amount_details", "icon": "IndianRupee"}
        ]
    }
]

template = """import { Building2, MapPin, Calendar, ArrowLeft, ExternalLink, FileText, CheckCircle2, AlertCircle, Briefcase, IndianRupee, GraduationCap, Link2, FileCheck } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function UpdateDetails(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const { data: record, error } = await supabase
    .from('{table}')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !record) {
    notFound();
  }

  // Determine Deadline State (if applicable)
  let deadlineState = "ACTIVE";
  if (record.{dateField}) {
    const end = new Date(record.{dateField});
    const now = new Date();
    const daysLeft = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (daysLeft < 0) deadlineState = "CLOSED";
    else if (daysLeft <= 7) deadlineState = "CLOSING_SOON";
  }

  const isVerified = record.status === 'PUBLISHED' && record.verification_status === 'VERIFIED';

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      {/* Top Banner / Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/{route}" className="inline-flex items-center text-sm font-bold text-{typeColor}-600 dark:text-{typeColor}-400 mb-6 hover:underline">
            <ArrowLeft size={16} className="mr-1" /> Back to List
          </Link>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {isVerified && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> VERIFIED
              </span>
            )}
            {deadlineState === 'CLOSED' && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                CLOSED / PAST
              </span>
            )}
            {deadlineState === 'CLOSING_SOON' && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                CLOSING SOON
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
            {record.{titleField}}
          </h1>

          {record.{orgField} && (
            <div className="flex items-center gap-2 text-lg font-medium text-slate-600 dark:text-slate-300 mb-6">
              <Building2 size={20} className="text-slate-400" />
              <span>{record.{orgField}}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
             <ShareButtons title={record.{titleField}} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Facts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Briefcase className="text-{typeColor}-500" size={20} /> Overview
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {META_BLOCK}
            </div>
          </div>

          <AdBanner dataAdSlot="1234567890" />

          {/* Description */}
          {record.unique_description && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <FileText className="text-{typeColor}-500" size={20} /> Details & Description
                </h2>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none prose-a:text-{typeColor}-600 dark:prose-a:text-{typeColor}-400 prose-img:rounded-xl">
                <ReactMarkdown>{record.unique_description}</ReactMarkdown>
              </div>
            </div>
          )}

          {record.unique_description_assamese && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">অসমীয়াত বিৱৰণ (Assamese Description)</h2>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{record.unique_description_assamese}</ReactMarkdown>
              </div>
            </div>
          )}
          
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Important Dates & Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24">
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="text-{typeColor}-500" size={18} /> Important Dates
              </h3>
              
              <div className="space-y-4">
                {record.{dateField} && (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{dateLabel}</span>
                    <span className={`font-bold ${deadlineState === 'CLOSED' ? 'text-red-500' : deadlineState === 'CLOSING_SOON' ? 'text-amber-500' : 'text-slate-800 dark:text-white'}`}>
                      {new Date(record.{dateField}).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date Posted</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {record.scraped_at ? new Date(record.scraped_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3 bg-slate-50 dark:bg-slate-800/50">
              {record.{primaryUrl} ? (
                <a href={record.{primaryUrl}} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-{typeColor}-600 hover:bg-{typeColor}-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm text-center">
                  {primaryLabel} <ExternalLink size={18} />
                </a>
              ) : null}

              {record.{secondaryUrl} ? (
                <a href={record.{secondaryUrl}} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm text-center">
                  <Link2 size={18} /> Source Reference
                </a>
              ) : null}

              {(!record.{primaryUrl} && !record.{secondaryUrl}) && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-medium italic">
                  Links currently unavailable.
                </p>
              )}
            </div>
            
            {/* Verification / Source Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-1 bg-white dark:bg-slate-900 text-center">
              {isVerified ? (
                <p className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1"><CheckCircle2 size={12}/> Verified Source</p>
              ) : (
                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><AlertCircle size={12}/> Unverified Source</p>
              )}
              <p className="text-xs text-slate-500">Data provided for informational purposes.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
"""

for r in routes:
    out_dir = f"src/app/{r['route']}/[id]"
    os.makedirs(out_dir, exist_ok=True)
    
    meta_block = ""
    for m in r['meta']:
        meta_block += f"""
              {{record.{m['field']} && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{m['label']}</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <{m['icon']} size={{16}} className="text-slate-400" /> {{record.{m['field']}}}
                  </p>
                </div>
              )}}"""
              
    content = template.replace("{table}", r['table'])
    content = content.replace("{route}", r['route'])
    content = content.replace("{typeColor}", r['typeColor'])
    content = content.replace("{titleField}", r['titleField'])
    content = content.replace("{orgField}", r['orgField'])
    content = content.replace("{dateField}", r['dateField'])
    content = content.replace("{dateLabel}", r['dateLabel'])
    content = content.replace("{primaryUrl}", r['primaryUrl'])
    content = content.replace("{secondaryUrl}", r['secondaryUrl'])
    content = content.replace("{primaryLabel}", r['primaryLabel'])
    content = content.replace("{META_BLOCK}", meta_block)
    
    with open(f"{out_dir}/page.tsx", "w", encoding="utf-8") as f:
        f.write(content)

print("Created 5 detail pages successfully.")
