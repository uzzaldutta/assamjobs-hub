import PageHeader from "@/components/PageHeader";
import FeedList from "@/components/FeedList";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function GovtJobsPage() {
  let jobs: any[] = [];
  
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', 'GOVERNMENT')
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

  // Deduplicate array
  const seenHashes = new Set();
  jobs = jobs.filter(job => {
    const hash = `${job.title}_${job.organization}`.toLowerCase().replace(/\s+/g, '');
    if (seenHashes.has(hash)) return false;
    seenHashes.add(hash);
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PageHeader 
        title="Government Jobs" 
        subtitle="Latest Govt Jobs in Assam, APSC, ADRE, and Central Govt Notifications."
        theme="blue"
      />
      <div className="px-4 py-8 max-w-7xl mx-auto w-full">
        <FeedList initialJobs={jobs} defaultFilter="GOVERNMENT" hideFilters={true} />
      </div>
    </div>
  );
}
