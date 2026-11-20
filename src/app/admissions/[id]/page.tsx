import { Metadata } from "next";
import { Building2, Calendar, ArrowLeft, ExternalLink, FileText, CheckCircle2, AlertCircle, Briefcase, IndianRupee, GraduationCap, Link2, CheckSquare, ShieldAlert } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { formatSafeDate } from "@/lib/dateUtils";
import JobFaqSection, { FaqItem } from "@/components/JobFaqSection";

export const revalidate = 86400; // 24h caching - On-demand revalidation

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  let { data: record } = await supabase.from('jobs').select('*').eq('id', params.id).single();
  if (!record) {
    const { data: admRecord } = await supabase.from('admissions').select('*').eq('id', params.id).single();
    if (admRecord) record = admRecord;
  }
  
  if (!record || record.status !== 'PUBLISHED') {
    return { title: 'Not Found', robots: { index: false } };
  }

  const org = record.organization || record.institution || 'AssamJobsHub';
  const title = `${record.title} Admission - Eligibility, Application & Dates | ${org}`;
  const desc = `Admission details for ${record.title} offered by ${org}. Check eligibility criteria, seat capacity, fee structure, counseling schedule, and apply online.`;
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobshub.com';
  const url = `${baseUrl}/admissions/${record.id}`;

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

export default async function AdmissionDetails(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  let { data: record, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !record) {
    const { data: admRecord } = await supabase
      .from('admissions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (admRecord) {
      record = admRecord;
    } else {
      notFound();
    }
  }

  const deadline = record.closing_date || record.last_date;
  let deadlineState = "ACTIVE";
  if (deadline) {
    const end = new Date(deadline);
    const now = new Date();
    const daysLeft = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (daysLeft < 0) deadlineState = "CLOSED";
    else if (daysLeft <= 7) deadlineState = "CLOSING_SOON";
  }

  const isVerified = record.status === 'PUBLISHED' && record.verification_status === 'VERIFIED';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobshub.com';
  const instName = record.organization || record.institution || "the institution";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Admissions", "item": `${baseUrl}/admissions` },
      { "@type": "ListItem", "position": 3, "name": record.title, "item": `${baseUrl}/admissions/${record.id}` }
    ]
  };

  const faqs: FaqItem[] = [
    {
      question: `What is the eligibility requirement for ${record.title}?`,
      answer: record.qualification || record.eligibility 
        ? `The prescribed qualification is: ${record.qualification || record.eligibility}. Please refer to the official prospectus for minimum qualifying marks.`
        : `Applicants must satisfy the academic qualifications specified by ${instName}. Check the official notification link for stream-wise criteria.`
    },
    {
      question: `How can I submit the admission application form?`,
      answer: `Click the 'Apply Now' button in the sidebar to access the official admission portal of ${instName}. Register with your mobile number/email, fill in the academic details, upload required certificates/photos, and pay the registration fee.`
    },
    {
      question: `What documents are required during counseling and seat allotment?`,
      answer: `Mandatory documents include: 1) Class 10 Admit Card / Birth Certificate for age verification, 2) Marksheets and Pass Certificates of all qualifying exams, 3) Permanent Resident Certificate (PRC) or Domicile proof, 4) Category/Caste certificate if applicable, and 5) Passport photographs.`
    },
    {
      question: `Can I apply if my qualifying exam results are awaiting declaration?`,
      answer: `Generally, candidates appearing in the final examination can apply under the 'Appeared/Result Awaited' category, provided they submit the valid marksheet before the physical verification/counseling deadline.`
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": record?.title,
            "description": `Details for ${record?.title} by ${instName}`,
            "url": `${baseUrl}/admissions/${record?.id}`
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Top Banner / Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/admissions" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Admissions</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-800 dark:text-gray-200 truncate max-w-[150px] sm:max-w-[300px]">{record.title}</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
              ADMISSION
            </span>
            {isVerified && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> VERIFIED
              </span>
            )}
            {deadlineState === 'CLOSED' && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                ADMISSION CLOSED
              </span>
            )}
            {deadlineState === 'CLOSING_SOON' && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                CLOSING SOON
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
            {record.title}
          </h1>

          {instName && (
            <div className="flex items-center gap-2 text-lg font-medium text-slate-600 dark:text-slate-300 mb-4">
              <Building2 size={20} className="text-slate-400" />
              <span>{instName}</span>
            </div>
          )}

          {/* E-E-A-T Editorial Byline & Standards */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-6 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 size={14} /> Fact-Checked by Editorial Desk
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>Published: {formatSafeDate(record.scraped_at)}</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <Link href="/editorial-policy" className="hover:underline text-violet-600 dark:text-violet-400 font-semibold">
              Verification Standards
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <ShareButtons title={record.title} />
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
                <Briefcase className="text-violet-500" size={20} /> Course & Admission Overview
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(record.qualification || record.eligibility) && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Eligibility Criteria</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <GraduationCap size={16} className="text-slate-400" /> {record.qualification || record.eligibility}
                  </p>
                </div>
              )}
              {record.application_fee && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Application / Registration Fee</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <IndianRupee size={16} className="text-slate-400" /> {record.application_fee}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step-by-Step Instructions & Counseling Guidelines */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CheckSquare className="text-violet-500" size={20} /> Admission Application & Verification Guide
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <ol className="space-y-3 list-decimal list-inside text-sm text-slate-600 dark:text-slate-300">
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Verify Eligibility:</strong> Read through the prospectus to ensure you satisfy minimum marks in qualifying exams.</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Online Application:</strong> Click the official application link on this page, create candidate login, and fill the admission form.</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Upload Documents:</strong> Upload passport photo, signature, qualifying marksheets, and domicile/caste certificates.</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Pay Fee & Retain Confirmation:</strong> Complete the transaction online and preserve the application acknowledgment slip.</li>
              </ol>

              <div className="mt-4 p-4 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-xs text-violet-900 dark:text-violet-200 space-y-2">
                <p className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle size={14} /> Counseling Document Checklist:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Original Marksheets of 10th, 12th, or Degree examinations.</li>
                  <li>Transfer / Migration Certificate from last attended institution.</li>
                  <li>Assam PRC / Domicile Certificate for reserved state quota seats.</li>
                  <li>Valid Category/EWS certificate (if seeking reservation benefits).</li>
                </ul>
              </div>
            </div>
          </div>

          <AdBanner dataAdSlot="1234567890" />

          {/* Description */}
          {record.unique_description && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <FileText className="text-violet-500" size={20} /> Details & Description
                </h2>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none prose-a:text-violet-600 dark:prose-a:text-violet-400 prose-img:rounded-xl">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{record.unique_description}</ReactMarkdown>
              </div>
            </div>
          )}

          {record.unique_description_assamese && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">অসমীয়াত বিৱৰণ (Assamese Description)</h2>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{record.unique_description_assamese}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* FAQ Accordion Section */}
          <JobFaqSection faqs={faqs} title="Frequently Asked Questions (Admission & Counseling)" />

          {/* Statutory Advisory Notice */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-300 space-y-2">
            <div className="font-bold uppercase tracking-wider flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <ShieldAlert size={16} /> Statutory Advisory & Verification Notice
            </div>
            <p>
              AssamJobsHub (assamjobshub.com) is an educational information portal. We are NOT affiliated with {instName}.
            </p>
            <p>
              Students are strictly advised to review the official university/board prospectus for authentic seat reservation policies, counseling fees, and intake requirements before submitting applications.
            </p>
          </div>
          
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Important Dates & Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24">
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="text-violet-500" size={18} /> Important Dates
              </h3>
              
              <div className="space-y-4">
                {deadline && (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Application Deadline</span>
                    <span className={`font-bold ${deadlineState === 'CLOSED' ? 'text-red-500' : deadlineState === 'CLOSING_SOON' ? 'text-amber-500' : 'text-slate-800 dark:text-white'}`}>
                      {formatSafeDate(deadline)}
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date Posted</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {formatSafeDate(record.scraped_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3 bg-slate-50 dark:bg-slate-800/50">
              {record.apply_url ? (
                <a href={record.apply_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm text-center">
                  Apply Now <ExternalLink size={18} />
                </a>
              ) : null}

              {(record.official_pdf_url || record.official_source_url) ? (
                <a href={record.official_pdf_url || record.official_source_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm text-center">
                  <Link2 size={18} /> Prospectus / Official Source
                </a>
              ) : null}

              {(!record.apply_url && !record.official_pdf_url && !record.official_source_url) && (
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
                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><AlertCircle size={12}/> Editorial Monitored</p>
              )}
              <p className="text-xs text-slate-500">Cross-referenced with institute portals.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}