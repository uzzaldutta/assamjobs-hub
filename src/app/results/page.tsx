import PageHeader from "@/components/PageHeader";
import FeedList from "@/components/FeedList";
import RecentMarquee from "@/components/RecentMarquee";
import { Award } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function ResultsPage() {
  let allResults: any[] = [];
  
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', 'EXAM_UPDATE')
      .order('scraped_at', { ascending: false });
      
      if (data) {
      allResults = data.map(job => ({
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


  // Deduplicate array (keeps the first occurrence based on Title + Organization)
  const seenHashes = new Set();
  allResults = allResults.filter(job => {
    const hash = `${job.title}_${job.organization}`.toLowerCase().replace(/\s+/g, '');
    if (seenHashes.has(hash)) return false;
    seenHashes.add(hash);
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader 
        title="Exam Results" 
        subtitle="Check the latest results for Assam govt and private exams" 
        theme="green" 
      />

      <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 mt-2">
        <RecentMarquee jobs={allResults} title="Recent Results" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Recently Announced Results</h3>
        </div>
        <FeedList initialJobs={allResults} defaultFilter="EXAM" hideFilters={true} />
      </div>
    </div>
  );
}
