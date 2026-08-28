import FilterBar from "@/components/FilterBar";
import FeedList from "@/components/FeedList";
import SubscribeForm from "@/components/SubscribeForm";
import JobCard from "@/components/JobCard";
import RecentMarquee from "@/components/RecentMarquee";
import HeroSection from "@/components/HeroSection";
import AdSidebar from "@/components/AdSidebar";
import { Search } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { deduplicateJobs } from "@/lib/dedup";

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function Home(props: { searchParams?: Promise<{ search?: string }> }) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams?.search;

  let liveJobs: any[] = [];
  
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .neq('category', 'BANNED_KEYWORD')
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

  // Filter out non-job spam/promotional posts scraped by accident
  const spamKeywords = ["bio-data maker", "scheme", "merit award", "scholarship", "whatsapp group", "telegram", "join our"];
  let allJobs = liveJobs.filter(job => {
    if (!job.title) return false;
    const lowerTitle = job.title.toLowerCase();
    return !spamKeywords.some(keyword => lowerTitle.includes(keyword));
  });

  // Apply Search Filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    allJobs = allJobs.filter(job => 
      (job.title && job.title.toLowerCase().includes(q)) || 
      (job.organization && job.organization.toLowerCase().includes(q)) ||
      (job.district && job.district.toLowerCase().includes(q))
    );
  }

  return (
    
    <div className="flex flex-col min-h-screen">
      {searchQuery ? (
        <div className="px-4 py-12 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4">
              &larr; Back to Home
            </Link>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
              Search Results for <span className="text-blue-600">"{searchQuery}"</span>
            </h2>
            <p className="text-slate-500 mt-2">Found {allJobs.length} matching opportunities</p>
          </div>
          
          {allJobs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No results found</h3>
              <p className="text-slate-500">Try adjusting your search terms or browsing categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="px-4 md:px-6 relative z-10">
            <HeroSection />
          </div>

          <div className="px-4 relative z-10 max-w-7xl mx-auto w-full mt-6">
            <RecentMarquee jobs={allJobs} title="Closing Soon" />

            {/* ─── FULL-WIDTH QUICK CATEGORY TABS ─── */}
            <div className="w-full mt-6 mb-6">
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">

                {/* Govt Jobs */}
                <Link href="/govt-jobs" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-center group active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm leading-tight">Govt Jobs</h3>
                </Link>

                {/* Private Jobs */}
                <Link href="/private-jobs" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-center group active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm leading-tight">Private Jobs</h3>
                </Link>

                {/* Admissions */}
                <Link href="/admissions" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-center group active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm leading-tight">Admissions</h3>
                </Link>

                {/* Exams */}
                <Link href="/admit-cards" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all text-center group active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm leading-tight">Exams</h3>
                </Link>

                {/* Mock Test */}
                <Link href="/mock-tests" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-300 transition-all text-center group active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm leading-tight">Mock Test</h3>
                </Link>

                {/* Tenders */}
                <Link href="/tenders" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-pink-300 transition-all text-center group active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm leading-tight">Tenders</h3>
                </Link>

                {/* Admits */}
                <Link href="/admit-cards" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-cyan-300 transition-all text-center group active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm leading-tight">Admits</h3>
                </Link>

                {/* Railway */}
                <Link href="/railway-jobs" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-center group active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm leading-tight">Railway</h3>
                </Link>

              </div>
            </div>

            {/* ─── 12-COLUMN GRID: FeedList + Ad Sidebar ─── */}
            {/* Ad sidebar now sits BELOW the quick links, aligned only with the feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* MAIN CONTENT (70%) */}
              <div className="lg:col-span-8 flex flex-col">
                <FeedList initialJobs={allJobs} />
              </div>

              {/* SIDEBAR (30%) - FOR ADS AND PROMOS */}
              <AdSidebar />
            </div>
          </div>
        </>
      )}
    </div>

  );
}
