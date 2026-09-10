import { Metadata } from "next";

import { Building2, MapPin, Users, Calendar, ArrowLeft, ExternalLink, FileText, CheckCircle2, AlertCircle, Briefcase, IndianRupee, GraduationCap, Link2 } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { extractAdvtNo } from "@/lib/ingestion/duplicate-matcher";

export const revalidate = 86400; // 24h caching - On-demand revalidation



export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: job } = await supabase.from('jobs').select('*').eq('id', params.id).single();
  
  if (!job || job.status !== 'PUBLISHED') {
    return { title: 'Not Found', robots: { index: false } };
  }

  const org = job.organization || 'AssamJobs Hub';
  const title = `${job.title} at ${org}`;
  const desc = `Details for ${job.title} provided by ${org}. Check important dates, application links, and official notifications.`;
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com';
  const url = `${baseUrl}/jobs/${job.id}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
    }
  };
}

export default async function JobDetails(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !job || job.status !== 'PUBLISHED') {
    notFound();
  }

  // Determine Deadline State
  let deadlineState = "ACTIVE";
  if (job.last_date) {
    const end = new Date(job.last_date);
    const now = new Date();
    const daysLeft = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (daysLeft < 0) deadlineState = "CLOSED";
    else if (daysLeft <= 7) deadlineState = "CLOSING_SOON";
  }

  const isVerified = job.status === 'PUBLISHED' && job.verification_status === 'VERIFIED';
  const advtNo = extractAdvtNo(job.title) || extractAdvtNo(job.unique_description);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      {/* Top Banner / Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-8">
        
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "name": job.title,
            "description": `Details for ${job.title} by ${job.organization}`,
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com'}/jobs/${job.id}`
          })
        }}
      />

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/jobs" className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-6 hover:underline">
            <ArrowLeft size={16} className="mr-1" /> Back to Jobs
          </Link>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${job.job_type === 'GOVERNMENT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800'}`}>
              {job.job_type || 'JOB'}
            </span>
            {isVerified && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> VERIFIED
              </span>
            )}
            {deadlineState === 'CLOSED' && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                CLOSED
              </span>
            )}
            {deadlineState === 'CLOSING_SOON' && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                CLOSING SOON
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
            {job.title}
          </h1>

          {job.organization && (
            <div className="flex items-center gap-2 text-lg font-medium text-slate-600 dark:text-slate-300 mb-6">
              <Building2 size={20} className="text-slate-400" />
              <span>{job.organization}</span>
            </div>
          )}
          {advtNo && (
            <div className="flex items-center gap-2 text-md font-bold text-slate-500 dark:text-slate-400 mb-6 -mt-3">
              <FileText size={18} className="text-slate-400" />
              <span>Advt No: {advtNo}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
             <ShareButtons title={job.title} />
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
                <Briefcase className="text-indigo-500" size={20} /> Job Overview
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {job.vacancies && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Vacancies</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Users size={16} className="text-slate-400" /> {job.vacancies}
                  </p>
                </div>
              )}
              
              {job.district && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location / District</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" /> {job.district}
                  </p>
                </div>
              )}

              {job.qualification && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Required Qualification</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <GraduationCap size={16} className="text-slate-400" /> {job.qualification}
                  </p>
                </div>
              )}

              {job.age_limit && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Age Limit</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {job.age_limit}
                  </p>
                </div>
              )}

              {job.application_fee && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Application Fee</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed flex items-center gap-2">
                    <IndianRupee size={16} className="text-slate-400" /> {job.application_fee}
                  </p>
                </div>
              )}

            </div>
          </div>

          <AdBanner dataAdSlot="1234567890" />

          {/* Description */}
          {job.unique_description && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <FileText className="text-indigo-500" size={20} /> Details & Description
                </h2>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-xl">
                <ReactMarkdown>{job.unique_description}</ReactMarkdown>
              </div>
            </div>
          )}

          {job.unique_description_assamese && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">অসমীয়াত বিৱৰণ (Assamese Description)</h2>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{job.unique_description_assamese}</ReactMarkdown>
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
                <Calendar className="text-indigo-500" size={18} /> Important Dates
              </h3>
              
              <div className="space-y-4">
                {job.last_date && (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Last Date to Apply</span>
                    <span className={`font-bold ${deadlineState === 'CLOSED' ? 'text-red-500' : deadlineState === 'CLOSING_SOON' ? 'text-amber-500' : 'text-slate-800 dark:text-white'}`}>
                      {new Date(job.last_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date Posted</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {job.scraped_at ? new Date(job.scraped_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3 bg-slate-50 dark:bg-slate-800/50">
              {job.apply_url ? (
                <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm">
                  Apply Now <ExternalLink size={18} />
                </a>
              ) : null}

              {job.official_pdf_url ? (
                <a href={job.official_pdf_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm">
                  <FileText size={18} /> Official Notification
                </a>
              ) : job.official_source_url ? (
                <a href={job.official_source_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm">
                  <Link2 size={18} /> Official Source
                </a>
              ) : null}

              {(!job.apply_url && !job.official_pdf_url && !job.official_source_url) && (
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
