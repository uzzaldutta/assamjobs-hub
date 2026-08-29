import PageHeader from "@/components/PageHeader";
import TendersDashboard from "@/components/TendersDashboard";
import AdSidebar from "@/components/AdSidebar";
import { supabase } from "@/lib/supabase";
import { deduplicateJobs } from "@/lib/dedup";

export const revalidate = 60;

export default async function TendersPage() {
  let allTenders: any[] = [];
  
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .neq('category', 'BANNED_KEYWORD')
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

  // Smart deduplication: org + vacancies + lastDate + publishedDate
  allTenders = deduplicateJobs(allTenders);

  if (allTenders.length === 0) {
    allTenders = [
      { id: "t1", title: "Construction of RCC Bridge over River Brahmaputra", organization: "Public Works Department (PWD), Assam", type: "TENDER", category: "INFRASTRUCTURE", vacancies: "1", district: "Jorhat", lastDate: "2026-09-15", officialUrl: "https://assamtenders.gov.in", value: "â‚¹45.5 Cr" },
      { id: "t2", title: "Supply of Medical Equipment for Civil Hospitals", organization: "National Health Mission (NHM), Assam", type: "TENDER", category: "INFRASTRUCTURE", vacancies: "1", district: "Guwahati", lastDate: "2026-09-10", officialUrl: "https://assamtenders.gov.in", value: "â‚¹2.1 Cr" },
      { id: "t3", title: "Installation of Solar Street Lights in Rural Areas", organization: "Assam Power Distribution Company Limited (APDCL)", type: "TENDER", category: "INFRASTRUCTURE", vacancies: "1", district: "All Assam", lastDate: "2026-09-20", officialUrl: "https://assamtenders.gov.in", value: "â‚¹15.0 Cr" }
    ];
  }



  // Filter out non-job spam/promotional posts scraped by accident
  const spamKeywords = ["bio-data maker", "scheme", "merit award", "scholarship", "whatsapp group", "telegram", "join our"];
  allTenders = allTenders.filter(job => {
    if (!job.title) return false;
    const lowerTitle = job.title.toLowerCase();
    return !spamKeywords.some(keyword => lowerTitle.includes(keyword));
  });


  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PageHeader 
        title="Government Tenders" 
        subtitle="Latest e-Procurement notices and active tenders from Govt of Assam"
        theme="blue"
      />
      <div className="px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col">
            <TendersDashboard initialTenders={allTenders} />
          </div>
          <AdSidebar />
        </div>
      </div>
    </div>
  );
}

