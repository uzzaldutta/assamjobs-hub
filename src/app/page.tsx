import FilterBar from "@/components/FilterBar";
import FeedList from "@/components/FeedList";
import SubscribeForm from "@/components/SubscribeForm";
import JobCard from "@/components/JobCard";
import RecentMarquee from "@/components/RecentMarquee";
import HeroSection from "@/components/HeroSection";
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
        officialUrl: job.official_pdf_url || job.apply_url,
        createdAt: new Date(job.scraped_at || job.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
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
      
      <HeroSection />

      {/* Mobile Quick Categories (Wrapped Grid) */}
      <div className="lg:hidden w-full px-4 pt-4 pb-2 -mt-4 relative z-20">
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/admissions" className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full text-[13px] font-bold text-emerald-700 dark:text-emerald-300 shadow-sm">Admissions</Link>
          <Link href="/admit-cards" className="bg-white/90 backdrop-blur-sm dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full text-[13px] font-bold text-slate-700 dark:text-slate-200 shadow-sm">Admit Cards</Link>
          <Link href="/results" className="bg-white/90 backdrop-blur-sm dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full text-[13px] font-bold text-slate-700 dark:text-slate-200 shadow-sm">Results</Link>
          <Link href="/syllabus" className="bg-white/90 backdrop-blur-sm dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full text-[13px] font-bold text-slate-700 dark:text-slate-200 shadow-sm">Syllabus</Link>
          <Link href="/study-materials" className="bg-fuchsia-50 dark:bg-fuchsia-900/30 border border-fuchsia-200 dark:border-fuchsia-800 px-3 py-1.5 rounded-full text-[13px] font-bold text-fuchsia-700 dark:text-fuchsia-300 shadow-sm">Study Materials</Link>
          <Link href="/tenders" className="bg-white/90 backdrop-blur-sm dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50 px-3 py-1.5 rounded-full text-[13px] font-bold text-amber-700 dark:text-amber-400 shadow-sm">Tenders</Link>
          <Link href="/mock-tests" className="bg-white/90 backdrop-blur-sm dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/50 px-3 py-1.5 rounded-full text-[13px] font-bold text-indigo-700 dark:text-indigo-400 shadow-sm">Mock Tests</Link>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Recent Posts Section (Marquee) */}
        <div className="col-span-1 lg:col-span-4 mt-2">
          <RecentMarquee jobs={allJobs.filter(job => job.type !== "TENDER")} title="Recent Job Updates" />
        </div>

        {/* Center Feed (Jobs) */}
        <div className="col-span-1 lg:col-span-4 mt-2">
          <FeedList initialJobs={allJobs} />
        </div>
      </div>
      
    </div>
  );
}
