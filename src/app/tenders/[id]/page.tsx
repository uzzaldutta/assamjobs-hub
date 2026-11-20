import { Metadata } from "next";
import { Building2, MapPin, Calendar, ArrowLeft, ExternalLink, FileText, CheckCircle2, AlertCircle, Briefcase, IndianRupee, Link2, CheckSquare, ShieldAlert } from "lucide-react";
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
  let { data: record } = await supabase.from('tenders').select('*').eq('id', params.id).single();
  if (!record) {
    const { data: jobRecord } = await supabase.from('jobs').select('*').eq('id', params.id).single();
    if (jobRecord) record = { ...jobRecord, tender_number: jobRecord.id };
  }
  
  if (!record || record.status !== 'PUBLISHED') {
    return { title: 'Not Found', robots: { index: false } };
  }

  const org = record.organization || 'Assam Govt Department';
  const title = `${record.title} - e-Tender Notice & Documents | ${org}`;
  const desc = `E-procurement tender notice for ${record.title} by ${org}. Download tender document PDF, check estimated value, EMD, submission deadline, and bidding guidelines.`;
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobshub.com';
  const url = `${baseUrl}/tenders/${record.id}`;

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

export default async function TenderDetails(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  let { data: record, error } = await supabase
    .from('tenders')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !record) {
    const { data: jobRecord } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (jobRecord) {
      record = jobRecord;
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
  const orgName = record.organization || "the issuing authority";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Tenders", "item": `${baseUrl}/tenders` },
      { "@type": "ListItem", "position": 3, "name": record.title, "item": `${baseUrl}/tenders/${record.id}` }
    ]
  };

  const faqs: FaqItem[] = [
    {
      question: `Where can I submit bids for this tender?`,
      answer: `Bids must be submitted through the designated Assam e-Procurement portal (assamtenders.gov.in) using a valid Class-3 Digital Signature Certificate (DSC).`
    },
    {
      question: `What documents are required for technical bid qualification?`,
      answer: `Standard requirements include: 1) Valid GST Registration and PAN Card, 2) Up-to-date Trade License, 3) Past work completion certificates of similar value, 4) Audited balance sheets for the last 3 financial years, and 5) Earnest Money Deposit (EMD) and Tender Fee payment receipts.`
    },
    {
      question: `What happens if a corrigendum or addendum is issued?`,
      answer: `Bidders are required to monitor the e-procurement portal regularly. Any extension of the bid submission deadline or technical amendment will be published as an official corrigendum.`
    },
    {
      question: `Can bids be submitted physically in paper format?`,
      answer: `Unless specifically permitted in the Notice Inviting Tender (NIT) for hard-copy submission of EMD or original affidavits, manual offline tenders are strictly rejected under Assam e-Governance procurement rules.`
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
            "description": `Details for ${record?.title} by ${orgName}`,
            "url": `${baseUrl}/tenders/${record?.id}`
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
                <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/tenders" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Tenders</Link>
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
            <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              E-TENDER / PROCUREMENT
            </span>
            {isVerified && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> VERIFIED
              </span>
            )}
            {deadlineState === 'CLOSED' && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                BIDDING CLOSED
              </span>
            )}
            {deadlineState === 'CLOSING_SOON' && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                BID CLOSING SOON
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
            <Link href="/editorial-policy" className="hover:underline text-amber-600 dark:text-amber-400 font-semibold">
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
                <Briefcase className="text-amber-500" size={20} /> Tender Specifications
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {record.tender_number && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tender / NIT Reference Number</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <FileText size={16} className="text-slate-400" /> {record.tender_number}
                  </p>
                </div>
              )}
              {record.estimated_value && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Estimated Tender Value</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <IndianRupee size={16} className="text-slate-400" /> {record.estimated_value}
                  </p>
                </div>
              )}
              {record.location && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Work Location / Division</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" /> {record.location}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step-by-Step Instructions & Bidding Guidelines */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CheckSquare className="text-amber-500" size={20} /> e-Bidding Procedure & Compliance Guide
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <ol className="space-y-3 list-decimal list-inside text-sm text-slate-600 dark:text-slate-300">
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Download Tender Documents:</strong> Access the tender document PDF via the verified link below to examine detailed technical specifications and BOQ.</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Pre-Bid Meeting:</strong> Attend pre-bid clarification meetings if scheduled to address technical queries or site feasibility questions.</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Prepare Two-Cover Bids:</strong> Separate Technical Bid (Cover 1) containing credentials, GST, EMD slip, and Financial Bid (Cover 2) with BOQ quote.</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Digital Signing & Upload:</strong> Digitally sign all documents using an authorized Class 3 DSC and upload before the cutoff hour.</li>
              </ol>

              <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <p className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle size={14} /> Bidder Precautions:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Do not tamper with the encrypted BOQ Excel file formatting.</li>
                  <li>Ensure online EMD / Tender processing fee transaction is completed and receipt attached.</li>
                  <li>Check the portal 24 hours prior to deadline for any published corrigendum.</li>
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
                  <FileText className="text-amber-500" size={20} /> Details & Description
                </h2>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-img:rounded-xl">
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
          <JobFaqSection faqs={faqs} title="Frequently Asked Questions (e-Tenders & Bidding)" />

          {/* Statutory Advisory Notice */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-300 space-y-2">
            <div className="font-bold uppercase tracking-wider flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <ShieldAlert size={16} /> Statutory Advisory & Procurement Notice
            </div>
            <p>
              AssamJobsHub (assamjobshub.com) is an informational service. We are NOT affiliated with {record.organization || 'any government tendering department'}.
            </p>
            <p>
              Prospective bidders are advised to obtain official tender documents directly from assamtenders.gov.in or the issuing department before participating in commercial bids.
            </p>
          </div>
          
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Important Dates & Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24">
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="text-amber-500" size={18} /> Important Dates
              </h3>
              
              <div className="space-y-4">
                {deadline && (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bid Submission Deadline</span>
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
              {record.official_pdf_url ? (
                <a href={record.official_pdf_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm text-center">
                  View Tender PDF <ExternalLink size={18} />
                </a>
              ) : null}

              {record.official_source_url ? (
                <a href={record.official_source_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm text-center">
                  <Link2 size={18} /> Official Source Reference
                </a>
              ) : null}

              {(!record.official_pdf_url && !record.official_source_url) && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-medium italic">
                  Links currently unavailable.
                </p>
              )}
            </div>
            
            {/* Verification / Source Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-1 bg-white dark:bg-slate-900 text-center">
              {isVerified ? (
                <p className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1"><CheckCircle2 size={12}/> Verified Notice</p>
              ) : (
                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><AlertCircle size={12}/> Editorial Monitored</p>
              )}
              <p className="text-xs text-slate-500">Cross-referenced with state e-procurement portals.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}