import PageHeader from "@/components/PageHeader";
import FeedList from "@/components/FeedList";
import AdSidebar from "@/components/AdSidebar";
import { supabase } from "@/lib/supabase";
import { deduplicateJobs } from "@/lib/dedup";

export const revalidate = 60;

export default async function RailwayJobsPage() {
  let jobs: any[] = [];
  
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', 'RAILWAY')
      .order('scraped_at', { ascending: false });
      
    if (data) {
      jobs = data.map(job => ({
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

  // Smart deduplication: org + vacancies + lastDate + publishedDate
  jobs = deduplicateJobs(jobs);


  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PageHeader 
        title="Railway Jobs" 
        subtitle="Latest RRB, RRC, and NFR Railway Recruitment Notifications"
        theme="orange"
      />
      <div className="px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col">
            <FeedList initialJobs={jobs} defaultFilter="RAILWAY" hideFilters={true} />
          </div>
          <AdSidebar />
        </div>
      </div>
    </div>
  );
}

