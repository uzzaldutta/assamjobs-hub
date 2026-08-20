import FeedList from "@/components/FeedList";
import { FileText } from "lucide-react";
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
        officialUrl: job.official_pdf_url || job.apply_url
      }));
    }
  } catch(e) {
    console.error("Could not load from Supabase", e);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-indigo-600 dark:bg-indigo-900 px-4 pt-6 pb-8 md:pb-6 rounded-b-[2rem] md:rounded-2xl shadow-lg relative z-0 md:mt-4 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-white mb-1">Government Tenders</h2>
        <p className="text-indigo-100 text-sm mb-2">Latest e-Procurement notices and active tenders from Govt of Assam</p>
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
