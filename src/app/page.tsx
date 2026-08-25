import FilterBar from "@/components/FilterBar";
import FeedList from "@/components/FeedList";
import SubscribeForm from "@/components/SubscribeForm";
import JobCard from "@/components/JobCard";
import RecentMarquee from "@/components/RecentMarquee";
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
      
      {/* Search Header */}
      <div className="bg-indigo-600 dark:bg-indigo-900 px-4 pt-8 pb-10 rounded-b-[2rem] md:rounded-2xl shadow-lg relative z-0 md:mt-4">
        <h2 className="text-3xl font-extrabold text-white mb-2">Accelerate your career in Assam</h2>
        <p className="text-indigo-100 text-base mb-6 max-w-lg">Get instant updates on Govt & Private jobs, take free mock tests, and use AI tools to stand out from the crowd.</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/mock-tests" className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-3 px-6 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Take Free Mock Tests
          </Link>
          <Link href="/tools" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 border border-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            Explore AI Tools
          </Link>
        </div>
      </div>

      {/* Mobile Quick Categories (Horizontal Scroll) */}
      <div className="lg:hidden w-full overflow-x-auto hide-scrollbar px-4 pt-4 pb-2 -mt-4 relative z-20">
        <div className="flex gap-2">
          <Link href="/admit-cards" className="shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm">Admit Cards</Link>
          <Link href="/results" className="shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm">Results</Link>
          <Link href="/syllabus" className="shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm">Syllabus</Link>
          <Link href="/study-materials" className="shrink-0 bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-200 dark:border-fuchsia-900/50 px-4 py-2 rounded-full text-sm font-bold text-fuchsia-700 dark:text-fuchsia-400 shadow-sm">Study Materials</Link>
          <Link href="/tenders" className="shrink-0 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50 px-4 py-2 rounded-full text-sm font-bold text-amber-700 dark:text-amber-400 shadow-sm">Tenders</Link>
          <Link href="/mock-tests" className="shrink-0 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/50 px-4 py-2 rounded-full text-sm font-bold text-indigo-700 dark:text-indigo-400 shadow-sm">Mock Tests</Link>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Recent Posts Section (Marquee) */}
        <div className="col-span-1 lg:col-span-4 mt-2">
          <RecentMarquee jobs={allJobs.filter(job => job.type !== "TENDER").slice(0, 15)} title="Recent Job Updates" />
        </div>

        {/* Center Feed (Jobs) */}
        <div className="col-span-1 lg:col-span-4 mt-2">
          <FeedList initialJobs={allJobs} />
        </div>
      </div>
      
    </div>
  );
}
