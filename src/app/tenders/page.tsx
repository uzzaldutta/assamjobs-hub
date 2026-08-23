import FeedList from "@/components/FeedList";
import { FileText, Calculator } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function TendersPage() {
  let allTenders: any[] = [];
  
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', 'TENDER')
      .order('scraped_at', { ascending: false });
      
      if (data) {
      allTenders = data.map(job => ({
        ...job,
        type: job.job_type,
        lastDate: job.last_date,
        officialUrl: job.official_pdf_url || job.apply_url,
        createdAt: new Date(job.scraped_at || job.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      }));
    }
  } catch(e) {
    console.error("Could not load from Supabase", e);
  }

  // Fallback to mock data if the database is empty (e.g. if the Govt Portal Captcha blocked the scraper)
  if (allTenders.length === 0) {
    allTenders = [
      { id: "t1", title: "Construction of RCC Bridge over River Brahmaputra", organization: "Public Works Department (PWD), Assam", type: "TENDER", category: "INFRASTRUCTURE", vacancies: "1", district: "Jorhat", lastDate: "2026-09-15", officialUrl: "https://assamtenders.gov.in" },
      { id: "t2", title: "Supply of Medical Equipment for Civil Hospitals", organization: "National Health Mission (NHM), Assam", type: "TENDER", category: "INFRASTRUCTURE", vacancies: "1", district: "Guwahati", lastDate: "2026-09-10", officialUrl: "https://assamtenders.gov.in" },
      { id: "t3", title: "Installation of Solar Street Lights in Rural Areas", organization: "Assam Power Distribution Company Limited (APDCL)", type: "TENDER", category: "INFRASTRUCTURE", vacancies: "1", district: "All Assam", lastDate: "2026-09-20", officialUrl: "https://assamtenders.gov.in" }
    ];
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-indigo-600 dark:bg-indigo-900 px-4 pt-6 pb-8 md:pb-6 rounded-b-[2rem] md:rounded-2xl shadow-lg relative z-0 md:mt-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Government Tenders</h2>
            <p className="text-indigo-100 text-sm mb-2 md:mb-0">Latest e-Procurement notices and active tenders from Govt of Assam</p>
          </div>
          <Link href="/tools/tender-calculator" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl transition shadow-md whitespace-nowrap self-start md:self-auto">
            <Calculator size={18} /> Contractor Toolkit
          </Link>
        </div>
      </div>

      <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Active Tenders</h3>
        </div>
        <FeedList initialJobs={allTenders} defaultFilter="TENDERS" hideFilters={true} />
      </div>
    </div>
  );
}
