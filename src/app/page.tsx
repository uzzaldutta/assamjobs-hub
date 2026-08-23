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

      {/* Main Layout Grid */}
      <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Recent Posts Section */}
        <div className="col-span-1 lg:col-span-4 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recent Posts</h3>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {allJobs.slice(0, 5).map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="min-w-[280px] max-w-[300px] snap-start bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                      {job.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">New</span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                    {job.title}
                  </h4>
                </div>
                <div className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="truncate max-w-[150px]">{job.organization}</span>
                  <span className="text-pink-600 dark:text-pink-400">View →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Center Feed (Jobs) */}
        <div className="col-span-1 lg:col-span-4 mt-2">
          <FeedList initialJobs={allJobs} />
        </div>
      </div>
      
    </div>
  );
}
