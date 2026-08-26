import PageHeader from "@/components/PageHeader";
import FeedList from "@/components/FeedList";
import RecentMarquee from "@/components/RecentMarquee";
import AdSidebar from "@/components/AdSidebar";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function AdmitCardsPage() {
  let allAdmitCards: any[] = [];
  
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', 'EXAM_UPDATE')
      .order('scraped_at', { ascending: false });
      
    if (data) {
      // For now, filter EXAM_UPDATEs that mention "admit" in the title
      allAdmitCards = data
        .filter(job => job.title.toLowerCase().includes('admit') || job.title.toLowerCase().includes('hall ticket'))
        .map(job => ({
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
  allAdmitCards = allAdmitCards.filter(job => {
    const hash = `${job.title}_${job.organization}`.toLowerCase().replace(/\s+/g, '');
    if (seenHashes.has(hash)) return false;
    seenHashes.add(hash);
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader 
        title="Download Admit Cards" 
        subtitle="Get the latest hall tickets for upcoming exams" 
        theme="purple" 
      />

      <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 mt-2">
        <RecentMarquee jobs={allAdmitCards} title="Recent Admit Cards" />
        <div className="px-4 py-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Latest Admit Cards</h3>
              </div>
              <FeedList initialJobs={allAdmitCards} defaultFilter="EXAM" hideFilters={true} />
            </div>
            <AdSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
