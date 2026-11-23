import { Metadata } from "next";
import { Building2, Calendar, ArrowLeft, ExternalLink, FileText, CheckCircle2, AlertCircle, Briefcase, Link2, FileCheck, CheckSquare, ShieldAlert } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { formatSafeDate } from "@/lib/dateUtils";
import JobFaqSection, { FaqItem } from "@/components/JobFaqSection";
import MobileStickyActionDock from "@/components/MobileStickyActionDock";

export const revalidate = 86400; // 24h caching - On-demand revalidation

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  let { data: record } = await supabase.from('admit_cards').select('*').eq('id', params.id).single();
  if (!record) {
    const { data: jobRecord } = await supabase.from('jobs').select('*').eq('id', params.id).single();
    if (jobRecord) record = { ...jobRecord, exam_date: jobRecord.last_date };
  }
  
  if (!record || record.status !== 'PUBLISHED') {
    return { title: 'Not Found', robots: { index: false } };
  }

  const org = record.organization || 'AssamJobsHub';
  const title = `${record.title} - Download Admit Card & Hall Ticket | ${org}`;
  const desc = `Download ${record.title} issued by ${org}. Get official admit card direct link, exam date, step-by-step download instructions, exam center rules, and latest updates.`;
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobshub.com';
  const url = `${baseUrl}/admit-cards/${record.id}`;

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

export default async function AdmitCardDetails(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  let { data: record, error } = await supabase
    .from('admit_cards')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !record) {
    // Fallback to jobs table
    const { data: jobRecord } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (jobRecord) {
      record = { ...jobRecord, exam_date: jobRecord.last_date };
    } else {
      notFound();
    }
  }

  // Determine Deadline State
  let deadlineState = "ACTIVE";
  if (record.exam_date) {
    const end = new Date(record.exam_date);
    const now = new Date();
    const daysLeft = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (daysLeft < 0) deadlineState = "CLOSED";
    else if (daysLeft <= 7) deadlineState = "CLOSING_SOON";
  }

  const isVerified = record.status === 'PUBLISHED' && record.verification_status === 'VERIFIED';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobshub.com';
  const orgName = record.organization || "the conducting authority";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Admit Cards", "item": `${baseUrl}/admit-cards` },
      { "@type": "ListItem", "position": 3, "name": record.title, "item": `${baseUrl}/admit-cards/${record.id}` }
    ]
  };

  const faqs: FaqItem[] = [
    {
      question: `How can I download the ${record.title}?`,
      answer: `To download your hall ticket, click the official download link provided in the action panel on this page, enter your Application Number / Registration ID and Date of Birth / Password, and download the PDF admit card.`
    },
    {
      question: `What documents are mandatory to carry to the examination center?`,
      answer: `Candidates must carry: 1) A clear printed copy of the Admit Card / Hall Ticket, 2) An original valid Government Photo ID (Aadhaar Card, PAN Card, Voter ID, or Driving License), 3) Two recent passport-size color photographs, and 4) A black/blue ballpoint pen.`
    },
    {
      question: `What should I do if there is a spelling mistake or discrepancy in my admit card?`,
      answer: `In case of any discrepancy in your name, photograph, category, or exam center, contact the official helpline or helpdesk of ${orgName} immediately before the examination date for corrections.`
    },
    {
      question: `Will the admit card be sent by post or courier?`,
      answer: `No. Admit cards are issued purely in digital format and must be downloaded online from the official examination portal.`
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
            "description": `Details for ${record?.title} by ${record?.organization}`,
            "url": `${baseUrl}/admit-cards/${record?.id}`
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
                <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/admit-cards" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Admit Cards</Link>
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
            <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
              ADMIT CARD
            </span>
            {isVerified && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> VERIFIED
              </span>
            )}
            {deadlineState === 'CLOSED' && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                EXAM CONCLUDED
              </span>
            )}
            {deadlineState === 'CLOSING_SOON' && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                EXAM APPROACHING
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
            {record.title}
          </h1>

          {record.organization && (
            <div className="flex items-center gap-2 text-lg font-medium text-slate-600 dark:text-slate-300 mb-4">
              <Building2 size={20} className="text-slate-400" />
              <span>{record.organization}</span>
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
            <Link href="/editorial-policy" className="hover:underline text-cyan-600 dark:text-cyan-400 font-semibold">
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
                <Briefcase className="text-cyan-500" size={20} /> Examination Overview
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {record.exam_name && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Name</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <FileCheck size={16} className="text-slate-400" /> {record.exam_name}
                  </p>
                </div>
              )}
              {record.exam_date && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Examination Date</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" /> {formatSafeDate(record.exam_date)}
                  </p>
                </div>
              )}
              {record.release_date && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Admit Card Release Date</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" /> {record.release_date}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step-by-Step Instructions & Exam Hall Guidelines */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CheckSquare className="text-cyan-500" size={20} /> How to Download Admit Card & Exam Day Guidelines
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <ol className="space-y-3 list-decimal list-inside text-sm text-slate-600 dark:text-slate-300">
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Visit the Official Link:</strong> Click the verified &apos;Download Admit Card&apos; button in the action card on this page to visit the official examination server.</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Enter Candidate Credentials:</strong> Input your Registration Number / Application ID and Date of Birth (DD-MM-YYYY) or Password.</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Verify Printed Details:</strong> Check your name spelling, photograph, signature, designated exam venue, reporting time, and shift details.</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Download & Print:</strong> Save the PDF hall ticket and print at least 2 clear copies on A4 paper for safe keeping.</li>
              </ol>

              <div className="mt-4 p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-900 dark:text-cyan-200 space-y-2">
                <p className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle size={14} /> Mandatory Exam Center Checklist:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Original Govt Photo ID Proof (Aadhaar Card, PAN Card, Voter ID, or Driving License).</li>
                  <li>Two passport-sized photographs matching the uploaded admit card picture.</li>
                  <li>Blue / Black transparent ballpoint pens.</li>
                  <li>Prohibited: Mobile phones, smart watches, calculators, or any Bluetooth/electronic gadgets.</li>
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
                  <FileText className="text-cyan-500" size={20} /> Details & Description
                </h2>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-img:rounded-xl">
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
          <JobFaqSection faqs={faqs} title="Frequently Asked Questions (Admit Card & Exam)" />

          {/* Statutory Advisory Notice */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-300 space-y-2">
            <div className="font-bold uppercase tracking-wider flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <ShieldAlert size={16} /> Statutory Advisory & Verification Notice
            </div>
            <p>
              AssamJobsHub (assamjobshub.com) is an independent recruitment notification service. We are NOT affiliated with {record.organization || 'any government authority'}. All hall ticket links and dates are compiled from official public gazettes and educational portals.
            </p>
            <p>
              Candidates should verify all exam session times, center addresses, and reporting protocols directly on the official department portal before the exam day.
            </p>
          </div>
          
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Important Dates & Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24">
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="text-cyan-500" size={18} /> Important Dates
              </h3>
              
              <div className="space-y-4">
                {record.exam_date && (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Date</span>
                    <span className={`font-bold ${deadlineState === 'CLOSED' ? 'text-red-500' : deadlineState === 'CLOSING_SOON' ? 'text-amber-500' : 'text-slate-800 dark:text-white'}`}>
                      {formatSafeDate(record.exam_date)}
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
                <a href={record.apply_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm text-center">
                  Download Admit Card <ExternalLink size={18} />
                </a>
              ) : null}

              {record.official_pdf_url ? (
                <a href={record.official_pdf_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm text-center">
                  <Link2 size={18} /> Official Source Reference
                </a>
              ) : null}

              {(!record.apply_url && !record.official_pdf_url) && (
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
              <p className="text-xs text-slate-500">Cross-referenced with state portals.</p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Mobile Sticky Action Dock (Reversible & High-Converting) */}
      <MobileStickyActionDock
        title={record.title}
        applyUrl={record.apply_url}
        officialPdfUrl={record.official_pdf_url}
        primaryActionLabel="Download Admit Card"
        deadlineState={deadlineState}
      />
    </div>
  );
}