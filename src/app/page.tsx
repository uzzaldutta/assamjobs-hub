import FilterBar from "@/components/FilterBar";
import FeedList from "@/components/FeedList";
import SubscribeForm from "@/components/SubscribeForm";
import JobCard from "@/components/JobCard";
import { Search } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate cache every 60 seconds

// Mock Data matching the Prisma Schema format
const mockJobs = [
  { id: "1", title: "Junior Assistant & Grade IV", organization: "Directorate of Secondary Education, Assam", type: "GOVERNMENT", category: "ASSAM_STATE", vacancies: "1,240", district: "All Assam", lastDate: "2026-09-15" },
  { id: "2", title: "Customer Support Executive", organization: "TechMahindra Guwahati", type: "PRIVATE", category: "LOCAL_PRIVATE", vacancies: "50", district: "Kamrup (M)", lastDate: "2026-08-30" },
  { id: "3", title: "ADRE Grade III Final Result Declared", organization: "State Level Recruitment Commission", type: "EXAM_UPDATE", category: "ASSAM_STATE", vacancies: "12,000", district: "All Assam", lastDate: "2026-08-20" },
  { id: "3a", title: "SSC CGL 2026 Notification", organization: "Staff Selection Commission", type: "EXAM_UPDATE", category: "CENTRAL_GOVT", vacancies: "7,500+", district: "All India (Assam Centers)", lastDate: "2026-09-01" },
  { id: "4", title: "Data Entry Operator", organization: "National Health Mission (NHM), Assam", type: "GOVERNMENT", category: "ASSAM_STATE", vacancies: "120", district: "Dibrugarh", lastDate: "2026-09-05" }
];

export default async function Home() {
  let liveJobs: any[] = [];
  
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('scraped_at', { ascending: false });
      
    if (data) {
      // Map cloud database fields to frontend props
      liveJobs = data.map(job => ({
        ...job,
        type: job.job_type,
        lastDate: job.last_date,
        officialUrl: job.official_pdf_url || job.apply_url
      }));
    }
  } catch(e) {
    console.error("Could not load from Supabase", e);
  }

  // Combine live jobs with mock jobs, ensuring live jobs appear first
  const liveJobIds = new Set(liveJobs.map(j => String(j.id)));
  const filteredMockJobs = mockJobs.filter(j => !liveJobIds.has(String(j.id)));
  const allJobs = [...liveJobs, ...filteredMockJobs];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Search Header */}
      <div className="bg-indigo-600 dark:bg-indigo-900 px-4 pt-6 pb-8 rounded-b-[2rem] md:rounded-2xl shadow-lg relative z-0 md:mt-4">
        <h2 className="text-2xl font-bold text-white mb-1">Find your next job in Assam</h2>
        <p className="text-indigo-100 text-sm">Latest Govt & Private updates in one place</p>
      </div>

      {/* Main Layout Grid */}
      <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Center Feed (Jobs) */}
        <div className="col-span-1 lg:col-span-4 mt-6">
          <FeedList initialJobs={allJobs} />
        </div>
      </div>
      
    </div>
  );
}
