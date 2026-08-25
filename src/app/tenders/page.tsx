import PageHeader from "@/components/PageHeader";
import TendersDashboard from "@/components/TendersDashboard";
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

  if (allTenders.length === 0) {
    allTenders = [
      { id: "t1", title: "Construction of RCC Bridge over River Brahmaputra", organization: "Public Works Department (PWD), Assam", type: "TENDER", category: "INFRASTRUCTURE", vacancies: "1", district: "Jorhat", lastDate: "2026-09-15", officialUrl: "https://assamtenders.gov.in", value: "₹45.5 Cr" },
      { id: "t2", title: "Supply of Medical Equipment for Civil Hospitals", organization: "National Health Mission (NHM), Assam", type: "TENDER", category: "INFRASTRUCTURE", vacancies: "1", district: "Guwahati", lastDate: "2026-09-10", officialUrl: "https://assamtenders.gov.in", value: "₹2.1 Cr" },
      { id: "t3", title: "Installation of Solar Street Lights in Rural Areas", organization: "Assam Power Distribution Company Limited (APDCL)", type: "TENDER", category: "INFRASTRUCTURE", vacancies: "1", district: "All Assam", lastDate: "2026-09-20", officialUrl: "https://assamtenders.gov.in", value: "₹15.0 Cr" }
    ];
  }


  // Deduplicate array (keeps the first occurrence based on Title + Organization)
  const seenHashes = new Set();
  allTenders = allTenders.filter(job => {
    const hash = `${job.title}_${job.organization}`.toLowerCase().replace(/\s+/g, '');
    if (seenHashes.has(hash)) return false;
    seenHashes.add(hash);
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PageHeader 
        title="Government Tenders" 
        subtitle="Latest e-Procurement notices and active tenders from Govt of Assam"
        theme="blue"
      />
      <TendersDashboard initialTenders={allTenders} />
    </div>
  );
}
