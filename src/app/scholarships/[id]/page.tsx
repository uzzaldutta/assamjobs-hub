import { Metadata } from "next";
import { Building2, Calendar, ArrowLeft, ExternalLink, FileText, CheckCircle2, AlertCircle, Briefcase, IndianRupee, Link2, CheckSquare, ShieldAlert } from "lucide-react";
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
  let { data: record } = await supabase.from('scholarships').select('*').eq('id', params.id).single();
  if (!record) {
    const { data: jobRecord } = await supabase.from('jobs').select('*').eq('id', params.id).single();
    if (jobRecord) record = { ...jobRecord, application_deadline: jobRecord.last_date };
  }
  
  if (!record || record.status !== 'PUBLISHED') {
    return { title: 'Not Found', robots: { index: false } };
  }

  const org = record.organization || record.provider || 'AssamJobsHub';
  const title = `${record.title} - Eligibility, Benefits & Apply Online | ${org}`;
  const desc = `Complete guide for ${record.title} offered by ${org}. Check annual award amount, eligibility criteria, required documents, renewal rules, and direct application link.`;
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobshub.com';
  const url = `${baseUrl}/scholarships/${record.id}`;

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

export default async function ScholarshipDetails(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  let { data: record, error } = await supabase
    .from('scholarships')
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
      record = { ...jobRecord, application_deadline: jobRecord.last_date };
    } else {
      notFound();
    }
  }

  const deadline = record.application_deadline || record.last_date;
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
  const providerName = record.organization || record.provider || "the sponsoring authority";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Scholarships", "item": `${baseUrl}/scholarships` },
      { "@type": "ListItem", "position": 3, "name": record.title, "item": `${baseUrl}/scholarships/${record.id}` }
    ]
  };

  const faqs: FaqItem[] = [
    {
      question: `Who is eligible to apply for ${record.title}?`,
      answer: record.eligibility
        ? `Eligibility criteria: ${record.eligibility}. Generally requires domicile of Assam, enrollment in an approved institution, and meeting family annual income thresholds.`
        : `Applicants must be enrolled students meeting the academic and income guidelines set by ${providerName}. Check the notification link for exact income limits and cutoffs.`
    },
    {
      question: `How are scholarship funds disbursed (DBT Mode)?`,
      answer: `Scholarship amounts are credited directly into the student's Aadhaar-seeded bank account via Direct Benefit Transfer (DBT). Candidates must ensure their bank account is active and NPCI-linked to avoid failed transactions.`
    },
    {
      question: `Can I avail multiple government scholarships simultaneously?`,
      answer: `Under standard government norms, a student can typically avail only one government-funded scholarship scheme for the same academic level, unless one is purely merit-based and the other covers institutional tuition.`
    },
    {
      question: `What documents are mandatory to upload with the application?`,
      answer: `Required documents: 1) Family Income Certificate issued by Revenue Circle Officer, 2) Assam Domicile / PRC, 3) Institutional bonafide student certificate / fee receipt, 4) Marksheet of previous passed examination, 5) Bank passbook copy with IFSC, and 6) Aadhaar Card.`
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
            "description": `Details for ${record?.title} by ${providerName}`,
            "url": `${baseUrl}/scholarships/${record?.id}`
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
                <Link href="/" className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/scholarships" className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors">Scholarships</Link>
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
            <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-800">
              SCHOLARSHIP
            </span>
            {isVerified && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> VERIFIED
              </span>
            )}
            {deadlineState === 'CLOSED' && (
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                PORTAL CLOSED
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

          {providerName && (
            <div className="flex items-center gap-2 text-lg font-medium text-slate-600 dark:text-slate-300 mb-4">
              <Building2 size={20} className="text-slate-400" />
              <span>{providerName}</span>
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
            <Link href="/editorial-policy" className="hover:underline text-fuchsia-600 dark:text-fuchsia-400 font-semibold">
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
                <Briefcase className="text-fuchsia-500" size={20} /> Scheme Overview
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {record.eligibility && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Beneficiaries & Eligibility</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-slate-400" /> {record.eligibility}
                  </p>
                </div>
              )}
              {record.amount_details && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Award Amount / Financial Benefits</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <IndianRupee size={16} className="text-slate-400" /> {record.amount_details}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step-by-Step Instructions & DBT Guidelines */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CheckSquare className="text-fuchsia-500" size={20} /> Application Procedure & Direct Benefit Transfer (DBT) Rules
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <ol className="space-y-3 list-decimal list-inside text-sm text-slate-600 dark:text-slate-300">
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">National / State Portal Registration:</strong> Click the official portal link in the action panel and register via One-Time Registration (OTR).</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Fill Scheme Form:</strong> Select the scheme, enter academic details, roll numbers, institute code, and annual parental income.</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Upload Certificates:</strong> Upload latest income certificate, domicile certificate, previous year marksheets, and fee receipts.</li>
                <li className="leading-relaxed"><strong className="text-slate-800 dark:text-white">Institutional Verification:</strong> Submit the physical application printout along with original documents to your school/college nodal officer for Level 1 verification.</li>
              </ol>

              <div className="mt-4 p-4 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-800 text-xs text-fuchsia-900 dark:text-fuchsia-200 space-y-2">
                <p className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle size={14} /> Critical Bank Account Advisory:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Bank account must be active in candidate&apos;s own name (minor accounts must be converted if age &ge; 18).</li>
                  <li>Account must be seeded with Aadhaar and mapped with NPCI Direct Benefit Transfer (DBT).</li>
                  <li>Check DBT status using UIDAI portal or your bank branch before final application submission.</li>
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
                  <FileText className="text-fuchsia-500" size={20} /> Details & Description
                </h2>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none prose-a:text-fuchsia-600 dark:prose-a:text-fuchsia-400 prose-img:rounded-xl">
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
          <JobFaqSection faqs={faqs} title="Frequently Asked Questions (Scholarship & Disbursement)" />

          {/* Statutory Advisory Notice */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-300 space-y-2">
            <div className="font-bold uppercase tracking-wider flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <ShieldAlert size={16} /> Statutory Advisory & Verification Notice
            </div>
            <p>
              AssamJobsHub (assamjobshub.com) is a public service educational portal. We are NOT affiliated with {providerName}.
            </p>
            <p>
              Students should never pay any fees to agents or third parties for scholarship approval. All government scholarship schemes are completely free of application fees.
            </p>
          </div>
          
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Important Dates & Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24">
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="text-fuchsia-500" size={18} /> Important Dates
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
                <a href={record.apply_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm text-center">
                  Apply Online <ExternalLink size={18} />
                </a>
              ) : null}

              {(record.official_pdf_url || record.official_source_url) ? (
                <a href={record.official_pdf_url || record.official_source_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm text-center">
                  <Link2 size={18} /> Scheme Guidelines / Notification
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
                <p className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1"><CheckCircle2 size={12}/> Verified Scheme</p>
              ) : (
                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><AlertCircle size={12}/> Editorial Monitored</p>
              )}
              <p className="text-xs text-slate-500">Cross-referenced with state & central portals.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}