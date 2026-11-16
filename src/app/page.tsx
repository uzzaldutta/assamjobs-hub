import HeroSection from "@/components/HeroSection";
import ClassicUpdatesBoard from "@/components/ClassicUpdatesBoard";
import CategoryGrid from "@/components/CategoryGrid";
import LatestUpdatesScroller, { FeedItem } from "@/components/LatestUpdatesScroller";
import SubscribeForm from "@/components/SubscribeForm";
import UnifiedJobMatrix from "@/components/UnifiedJobMatrix";
import TenderCard from "@/components/feeds/TenderCard";
import ScholarshipCard from "@/components/feeds/ScholarshipCard";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowRight, FileCheck, Receipt, GraduationCap, Sparkles } from "lucide-react";

export const revalidate = 86400; // 24h caching - On-demand revalidation

export const metadata = {
  title: "Assam Govt Jobs 2026 | Latest Assam Government & Private Jobs",
  description: "Find the latest Assam government jobs, private jobs, recruitment notifications, admit cards, results, exam preparation, and free mock tests at AssamJobsHub.",
  alternates: {
    canonical: "/",
  }
};

export default async function Home() {
  const today = new Date().toISOString();
  
  // 1. Fetch Feeds for Ticker
  const [
    { data: rJobs },
    { data: rTenders },
    { data: rAdmissions },
    { data: rResults },
    { data: rAdmitCards },
    { data: rScholarships }
  ] = await Promise.all([
    supabase.from('jobs').select('id, slug, title, organization, job_type, last_date, scraped_at').eq('status', 'PUBLISHED').order('scraped_at', { ascending: false }).limit(15),
    supabase.from('tenders').select('id, slug, title, organization, last_date, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(10),
    supabase.from('jobs').select('id, slug, title, organization, last_date, scraped_at').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION').order('scraped_at', { ascending: false }).limit(10),
    supabase.from('jobs').select('id, slug, title, organization, scraped_at').eq('status', 'PUBLISHED').or('title.ilike.%result%,title.ilike.%merit list%').order('scraped_at', { ascending: false }).limit(10),
    supabase.from('jobs').select('id, slug, title, organization, scraped_at').eq('status', 'PUBLISHED').or('title.ilike.%admit card%,title.ilike.%hall ticket%').order('scraped_at', { ascending: false }).limit(10),
    supabase.from('jobs').select('id, slug, title, organization, last_date, scraped_at').eq('status', 'PUBLISHED').or('job_type.eq.SCHOLARSHIP,title.ilike.%scholarship%,title.ilike.%scheme%').order('scraped_at', { ascending: false }).limit(10)
  ]);

  const mapToFeed = (items: any[], type: string, urlPrefix: string, orgField: string = 'organization'): FeedItem[] => {
    if (!items) return [];
    return items.map(item => ({
      id: item.id,
      title: item.title,
      organization: item[orgField] || 'Various Departments',
      badge_text: type === 'JOB' ? (item.job_type || 'GOVERNMENT') : type,
      url: `${urlPrefix}/${item.slug || item.id}`,
      last_date: item.last_date || null,
      created_at: item.created_at || item.scraped_at
    }));
  };

  const rawRecent = [
    ...mapToFeed(rJobs || [], 'JOB', '/jobs'),
    ...mapToFeed(rTenders || [], 'TENDER', '/tenders'),
    ...mapToFeed(rAdmissions || [], 'ADMISSION', '/admissions', 'institution_name'),
    ...mapToFeed(rResults || [], 'RESULT', '/results'),
    ...mapToFeed(rAdmitCards || [], 'ADMIT CARD', '/admit-cards'),
    ...mapToFeed(rScholarships || [], 'SCHOLARSHIP', '/scholarships', 'provider')
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 25);

  const [
    { data: cJobs },
    { data: cTenders },
    { data: cAdmissions },
    { data: cScholarships }
  ] = await Promise.all([
    supabase.from('jobs').select('id, slug, title, organization, job_type, last_date, scraped_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(15),
    supabase.from('tenders').select('id, slug, title, organization, last_date, created_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(10),
    supabase.from('jobs').select('id, slug, title, organization, last_date, created_at').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION').gte('last_date', today).order('last_date', { ascending: true }).limit(10),
    supabase.from('scholarships').select('id, slug, title, provider, last_date, created_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(10)
  ]);

  const uniqueRecent: FeedItem[] = [];
  const seenRecentIds = new Set();
  for (const item of rawRecent) {
    if (!seenRecentIds.has(item.id)) {
      seenRecentIds.add(item.id);
      uniqueRecent.push(item);
    }
  }

  const allClosing = [
    ...mapToFeed(cJobs || [], 'JOB', '/jobs'),
    ...mapToFeed(cTenders || [], 'TENDER', '/tenders'),
    ...mapToFeed(cAdmissions || [], 'ADMISSION', '/admissions', 'institution_name'),
    ...mapToFeed(cScholarships || [], 'SCHOLARSHIP', '/scholarships', 'provider')
  ].sort((a, b) => new Date(a.last_date!).getTime() - new Date(b.last_date!).getTime()).slice(0, 25);

  // 2. Fetch Data for Unified Job Matrix
  const [
    { data: govtJobs },
    { data: privateJobs },
    { data: railwayJobs },
    { data: closingSoonJobs },
    { data: recentResults },
    { data: recentAdmitCards },
    { data: recentAdmissions },
    { data: scholarships },
    { data: latestTenders }
  ] = await Promise.all([
    supabase.from('jobs').select('*').eq('status', 'PUBLISHED').eq('job_type', 'GOVERNMENT').order('scraped_at', { ascending: false }).limit(24),
    supabase.from('jobs').select('*').eq('status', 'PUBLISHED').eq('job_type', 'PRIVATE').order('scraped_at', { ascending: false }).limit(24),
    supabase.from('jobs').select('*').eq('status', 'PUBLISHED').eq('job_type', 'RAILWAY').order('scraped_at', { ascending: false }).limit(24),
    supabase.from('jobs').select('*').eq('status', 'PUBLISHED').gte('last_date', today).lte('last_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()).order('last_date', { ascending: true }).limit(24),
    supabase.from('results').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(12),
    supabase.from('admit_cards').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(12),
    supabase.from('jobs').select('*').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION').order('created_at', { ascending: false }).limit(12),
    supabase.from('scholarships').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(4),
    supabase.from('tenders').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(4)
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO & FAST SEARCH SECTION (Compact Phase 1) */}
      <HeroSection />

      {/* 2. CATEGORY ICON SHORTCUTS */}
      <div className="max-w-7xl mx-auto px-4">
        <CategoryGrid />
      </div>
      
      {/* 3. LATEST UPDATES TICKER & CLASSIC UPDATES BOARD */}
      <div className="max-w-7xl mx-auto px-4 mt-1">
        <LatestUpdatesScroller recentItems={uniqueRecent} closingSoonItems={allClosing} />
        <ClassicUpdatesBoard />
      </div>

      {/* 4. MAIN INTERACTIVE CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-10 sm:space-y-14">
        
        {/* PHASE 2: UNIFIED TABBED JOB MATRIX (Govt, Private, Railway, Closing, Admits, Results, Admissions) */}
        <UnifiedJobMatrix
          govtJobs={govtJobs || []}
          privateJobs={privateJobs || []}
          railwayJobs={railwayJobs || []}
          closingSoonJobs={closingSoonJobs || []}
          recentResults={recentResults || []}
          recentAdmitCards={recentAdmitCards || []}
          recentAdmissions={recentAdmissions || []}
        />

        {/* EXAM PREPARATION & FREE MOCK TESTS SHOWCASE */}
        <section className="bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-emerald-900/10 rounded-3xl p-6 sm:p-8 border border-indigo-100 dark:border-indigo-900/40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
                <Sparkles size={14} /> Exam Preparation Studio
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                ADRE 2.0, APSC & Police Mock Tests
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Full-length practice tests, topic-wise study notes, and syllabus breakdowns.
              </p>
            </div>
            <Link 
              href="/mock-tests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md self-start md:self-auto"
            >
              Start Free Mock Test <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/mock-tests" className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                <FileCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600">10 Full Mock Tests</h3>
              <p className="text-slate-500 text-xs">Simulated computer-based tests for ADRE Grade III/IV and APSC CCE.</p>
            </Link>

            <Link href="/study-materials" className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-teal-600">15 In-Depth Study Guides</h3>
              <p className="text-slate-500 text-xs">Assam history, geography factsheets, formulas, and PET exam guidelines.</p>
            </Link>

            <Link href="/syllabus" className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                <FileCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-purple-600">Official Exam Syllabus</h3>
              <p className="text-slate-500 text-xs">Official mark distributions, question patterns, and recommended booklists.</p>
            </Link>
          </div>
        </section>

        {/* SCHOLARSHIPS & TENDERS QUICK HUB */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SCHOLARSHIPS */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="text-teal-600" size={20} /> Latest Scholarships & Schemes
              </h3>
              <Link href="/scholarships" className="text-xs font-bold text-teal-600 hover:text-teal-700">View All →</Link>
            </div>
            <div className="space-y-3">
              {scholarships?.map(sch => <ScholarshipCard key={sch.id} scholarship={sch} />)}
              {(!scholarships || scholarships.length === 0) && (
                <div className="text-xs text-slate-500 italic py-4 text-center">No active scholarships listed today.</div>
              )}
            </div>
          </div>

          {/* TENDERS */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="text-rose-600" size={20} /> Official Assam Tenders
              </h3>
              <Link href="/tenders" className="text-xs font-bold text-rose-600 hover:text-rose-700">View All →</Link>
            </div>
            <div className="space-y-3">
              {latestTenders?.map(tender => <TenderCard key={tender.id} tender={tender} />)}
              {(!latestTenders || latestTenders.length === 0) && (
                <div className="text-xs text-slate-500 italic py-4 text-center">No active tenders listed today.</div>
              )}
            </div>
          </div>

        </section>

        {/* NEWSLETTER SUBSCRIBE */}
        <SubscribeForm />

      </main>
    </div>
  );
}
