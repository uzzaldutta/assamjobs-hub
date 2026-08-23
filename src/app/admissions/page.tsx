import FeedList from "@/components/FeedList";
import RecentMarquee from "@/components/RecentMarquee";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function AdmissionsPage() {
  let allAdmissions: any[] = [];
  
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', 'ADMISSION')
      .order('scraped_at', { ascending: false });
      
    if (data) {
      allAdmissions = data.map(job => ({
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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-indigo-600 dark:bg-indigo-900 px-4 pt-6 pb-8 md:pb-6 rounded-b-[2rem] md:rounded-2xl shadow-lg relative z-0 md:mt-4 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-white mb-1">Admissions</h2>
        <p className="text-indigo-100 text-sm mb-2">Latest admission notifications for top colleges, universities, and institutes</p>
      </div>

      <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 mt-2">
        <RecentMarquee jobs={allAdmissions.slice(0, 8)} title="Recent Admissions" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">All-India & Assam Admissions</h3>
        </div>
        {/* Pass defaultFilter as "ADMISSION" to ensure it matches the tag in FeedList */}
        <FeedList initialJobs={allAdmissions} defaultFilter="ADMISSION" hideFilters={true} />
      </div>
    </div>
  );
}
