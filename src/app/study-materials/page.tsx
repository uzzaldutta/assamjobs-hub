import FeedList from "@/components/FeedList";
import RecentMarquee from "@/components/RecentMarquee";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function StudyMaterialsPage() {
  let allMaterials: any[] = [];
  
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', 'STUDY_MATERIAL')
      .order('scraped_at', { ascending: false });
      
    if (data) {
      allMaterials = data.map(job => ({
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
      <div className="bg-fuchsia-600 dark:bg-fuchsia-900 px-4 pt-6 pb-8 md:pb-6 rounded-b-[2rem] md:rounded-2xl shadow-lg relative z-0 md:mt-4 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-white mb-1">Study Materials (PDFs)</h2>
        <p className="text-fuchsia-100 text-sm mb-2">Download free PDFs, previous year question papers, and preparation guides</p>
      </div>

      <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 mt-2">
        <RecentMarquee jobs={allMaterials.slice(0, 8)} title="Recent Uploads" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Browse Study Materials</h3>
        </div>
        {/* Pass defaultFilter as "STUDY_MATERIAL" to ensure it matches the tag in FeedList */}
        <FeedList initialJobs={allMaterials} defaultFilter="STUDY_MATERIAL" hideFilters={true} />
      </div>
    </div>
  );
}
