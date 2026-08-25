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
  let allJobs = [...liveJobs, ...filteredMockJobs];
  
  // Deduplicate array (keeps the first occurrence based on Title + Organization)
  const seenHashes = new Set();
  allJobs = allJobs.filter(job => {
    // Create a normalized hash (lowercase, no spaces) to catch slight variations
    const hash = `${job.title}_${job.organization}`.toLowerCase().replace(/\s+/g, '');
    if (seenHashes.has(hash)) {
      return false;
    }
    seenHashes.add(hash);
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      
      <HeroSection />

      {/* 4 Large Quick Categories (Unified Desktop & Mobile) */}
      <div className="w-full px-4 md:px-0 pt-6 pb-4 relative z-20 max-w-5xl mx-auto -mt-6 md:mt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Link href="/govt-jobs" className="flex flex-col items-center justify-center p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🏛</span>
            </div>
            <span className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200">Govt Jobs</span>
          </Link>
          
          <Link href="/private-jobs" className="flex flex-col items-center justify-center p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💼</span>
            </div>
            <span className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200">Private Jobs</span>
          </Link>

          <Link href="/admissions" className="flex flex-col items-center justify-center p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all group">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🎓</span>
            </div>
            <span className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200">Admissions</span>
          </Link>

          <Link href="/admit-cards" className="flex flex-col items-center justify-center p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition-all group">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📝</span>
            </div>
            <span className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200">Exams</span>
          </Link>
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
