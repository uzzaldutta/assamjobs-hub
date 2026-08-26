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

export default async function Home(props: { searchParams?: Promise<{ search?: string }> }) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams?.search;

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

  // Filter out non-job spam/promotional posts scraped by accident
  const spamKeywords = ["bio-data maker", "scheme", "merit award", "scholarship", "whatsapp group", "telegram", "join our"];
  allJobs = allJobs.filter(job => {
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
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              
              {/* MAIN CONTENT (70%) */}
              <div className="lg:col-span-8 flex flex-col">
                
                {/* 4 Quick Categories */}
                <div className="w-full mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/govt-jobs" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">Govt Jobs</h3>
                </Link>
                <Link href="/private-jobs" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md hover:indigo-300 transition-all text-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">Private Jobs</h3>
                </Link>
                <Link href="/admissions" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md hover:emerald-300 transition-all text-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">Admissions</h3>
                </Link>
                <Link href="/admit-cards" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md hover:purple-300 transition-all text-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">Exams</h3>
                </Link>
              </div>
            </div>

            <FeedList initialJobs={allJobs} />
              </div>
              
              {/* SIDEBAR (30%) - FOR ADS AND PROMOS */}
              <aside className="lg:col-span-4 hidden lg:block">
                <div className="sticky top-24 flex flex-col gap-6">
                  
                  {/* AD PLACEHOLDER */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Sponsored Content</span>
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    </div>
                    <h4 className="text-slate-600 dark:text-slate-400 font-bold mb-1">Ad Space Available</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center max-w-[200px]">This premium slot is perfectly optimized for AdSense or direct sponsors.</p>
                  </div>

                  {/* PROMO: AI MOCK TESTS */}
                  <Link href="/mock-tests/ai-generator" className="block bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                    <h4 className="font-black text-lg mb-2 relative z-10 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
                      AI Mock Tests
                    </h4>
                    <p className="text-violet-100 text-sm mb-4 relative z-10 leading-relaxed">Generate realistic 20-question mock tests for APSC, ADRE, and Assam Police instantly.</p>
                    <div className="bg-white text-violet-600 text-center text-sm font-bold px-4 py-2 rounded-lg w-full relative z-10 group-hover:bg-gray-50 transition-colors">Try it now &rarr;</div>
                  </Link>

                  {/* CTA: WHATSAPP */}
                  <a href="#" className="block bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Join Community
                    </h4>
                    <p className="text-emerald-600 dark:text-emerald-500/80 text-sm mb-4 leading-relaxed">Get instant alerts for admit cards, job updates, and results directly on your phone.</p>
                    <div className="bg-emerald-500 group-hover:bg-emerald-600 text-white text-center text-sm font-bold px-4 py-2 rounded-lg w-full transition-colors shadow-sm">Join WhatsApp Group</div>
                  </a>

                </div>
              </aside>

            </div>
          </div>
        </>
      )}
    </div>

  );
}
