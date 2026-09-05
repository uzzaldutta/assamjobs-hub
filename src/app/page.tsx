
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import LatestUpdatesScroller, { FeedItem } from "@/components/LatestUpdatesScroller";
import SubscribeForm from "@/components/SubscribeForm";
import JobCard from "@/components/JobCard";
import TenderCard from "@/components/feeds/TenderCard";
import AdmissionCard from "@/components/feeds/AdmissionCard";
import ResultCard from "@/components/feeds/ResultCard";
import AdmitCard from "@/components/feeds/AdmitCard";
import ScholarshipCard from "@/components/feeds/ScholarshipCard";
import AdSidebar from "@/components/AdSidebar";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Briefcase, Building2, Bell, FileCheck, FileText } from "lucide-react";

export const revalidate = 60; // 1 minute cache

export default async function Home() {

  // Unified Data Fetching for Latest Updates Scroller
  const today = new Date().toISOString();
  
  // 1. Fetch Recent Items
  const [
    { data: rJobs },
    { data: rTenders },
    { data: rAdmissions },
    { data: rResults },
    { data: rAdmitCards },
    { data: rScholarships }
  ] = await Promise.all([
    supabase.from('jobs').select('id, title, organization, job_type, last_date, scraped_at').eq('status', 'PUBLISHED').order('scraped_at', { ascending: false }).limit(15),
    supabase.from('tenders').select('id, title, organization, last_date, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(10),
    supabase.from('admissions').select('id, title, institution_name, last_date, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(10),
    supabase.from('results').select('id, title, organization, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(10),
    supabase.from('admit_cards').select('id, title, organization, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(10),
    supabase.from('scholarships').select('id, title, provider, last_date, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(10)
  ]);

  const mapToFeed = (items: any[], type: string, urlPrefix: string, orgField: string = 'organization'): FeedItem[] => {
    if (!items) return [];
    return items.map(item => ({
      id: item.id,
      title: item.title,
      organization: item[orgField] || 'Various Departments',
      badge_text: type === 'JOB' ? (item.job_type || 'GOVERNMENT') : type,
      url: `${urlPrefix}/${item.id}`,
      last_date: item.last_date || null,
      created_at: item.created_at || item.scraped_at
    }));
  };

  const allRecent = [
    ...mapToFeed(rJobs || [], 'JOB', '/jobs'),
    ...mapToFeed(rTenders || [], 'TENDER', '/tenders'),
    ...mapToFeed(rAdmissions || [], 'ADMISSION', '/admissions', 'institution_name'),
    ...mapToFeed(rResults || [], 'RESULT', '/results'),
    ...mapToFeed(rAdmitCards || [], 'ADMIT CARD', '/admit-cards'),
    ...mapToFeed(rScholarships || [], 'SCHOLARSHIP', '/scholarships', 'provider')
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 25);

  // 2. Fetch Closing Soon Items (Future dates)
  const [
    { data: cJobs },
    { data: cTenders },
    { data: cAdmissions },
    { data: cScholarships }
  ] = await Promise.all([
    supabase.from('jobs').select('id, title, organization, job_type, last_date, scraped_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(15),
    supabase.from('tenders').select('id, title, organization, last_date, created_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(10),
    supabase.from('admissions').select('id, title, institution_name, last_date, created_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(10),
    supabase.from('scholarships').select('id, title, provider, last_date, created_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(10)
  ]);

  const allClosing = [
    ...mapToFeed(cJobs || [], 'JOB', '/jobs'),
    ...mapToFeed(cTenders || [], 'TENDER', '/tenders'),
    ...mapToFeed(cAdmissions || [], 'ADMISSION', '/admissions', 'institution_name'),
    ...mapToFeed(cScholarships || [], 'SCHOLARSHIP', '/scholarships', 'provider')
  ].sort((a, b) => new Date(a.last_date!).getTime() - new Date(b.last_date!).getTime()).slice(0, 25);

  // Fetch Latest Govt Jobs

  const { data: govtJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'PUBLISHED')
    .eq('job_type', 'GOVERNMENT')
    .order('scraped_at', { ascending: false })
    .limit(15);

  // Fetch Latest Private Jobs
  const { data: privateJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'PUBLISHED')
    .eq('job_type', 'PRIVATE')
    .order('scraped_at', { ascending: false })
    .limit(10);

  // Fetch Closing Soon Jobs (Any type)
  const { data: closingSoonJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'PUBLISHED')
    .gte('last_date', new Date().toISOString())
    .lte('last_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('last_date', { ascending: true })
    .limit(15);

  // Fetch Latest Updates (Results, Admit Cards, Admissions)
  const { data: recentResults } = await supabase.from('results').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);
  const { data: recentAdmitCards } = await supabase.from('admit_cards').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);
  const { data: recentAdmissions } = await supabase.from('admissions').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);

  // Fetch Latest Tenders
  const { data: latestTenders } = await supabase.from('tenders').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);
  const { data: scholarships } = await supabase.from('scholarships').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4">
        <CategoryGrid />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-2">
        <LatestUpdatesScroller recentItems={allRecent} closingSoonItems={allClosing} />
      </div>
<main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        
        {/* LATEST GOVERNMENT JOBS */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="text-emerald-600 dark:text-emerald-400" /> Latest Government Jobs
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Recently verified government recruitment notifications.</p>
            </div>
            <Link href="/jobs?type=GOVERNMENT" className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md font-bold text-sm hover:bg-emerald-500/20 hover:scale-105 transition-all flex items-center gap-1 hidden sm:flex shadow-sm">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {govtJobs?.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
            {(!govtJobs || govtJobs.length === 0) && (
              <div className="col-span-full py-12 text-center text-slate-500">No recent government jobs found.</div>
            )}
          </div>
          <div className="mt-6 sm:hidden text-center">
            <Link href="/jobs?type=GOVERNMENT" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md text-emerald-600 dark:text-emerald-400 font-bold rounded-xl w-full justify-center hover:bg-emerald-500/20 transition-all shadow-sm">
              View All Govt Jobs <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* LATEST PRIVATE JOBS */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="text-blue-600 dark:text-blue-400" /> Latest Private Jobs
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Verified opportunities in the private sector.</p>
            </div>
            <Link href="/jobs?type=PRIVATE" className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 backdrop-blur-md font-bold text-sm hover:bg-blue-500/20 hover:scale-105 transition-all flex items-center gap-1 hidden sm:flex shadow-sm">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {privateJobs?.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
            {(!privateJobs || privateJobs.length === 0) && (
              <div className="col-span-full py-12 text-center text-slate-500">No recent private jobs found.</div>
            )}
          </div>
        </section>

        {/* CLOSING SOON SECTION */}
        {closingSoonJobs && closingSoonJobs.length > 0 && (
          <section className="bg-amber-50 dark:bg-amber-900/10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 border-y border-amber-100 dark:border-amber-900/30">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-amber-900 dark:text-amber-500 flex items-center gap-2">
                    <Bell className="text-amber-600 dark:text-amber-400" /> Closing Soon
                  </h2>
                  <p className="text-amber-700/70 dark:text-amber-500/70 mt-1">Don't miss these upcoming deadlines.</p>
                </div>
                <Link href="/jobs?status=CLOSING_SOON" className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 backdrop-blur-md font-bold text-sm hover:bg-amber-500/20 hover:scale-105 transition-all flex items-center gap-1 hidden sm:flex shadow-sm">
                  View All <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {closingSoonJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* UPCOMING EXAMS & PRACTICE */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="text-indigo-600 dark:text-indigo-400" /> Exams & Practice
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Prepare for your next test.</p>
            </div>
            <Link href="/exams" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold flex items-center gap-1 text-sm hidden sm:flex">
              Start Practice <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link href="/exams" className="group p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 transition-colors">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600">Upcoming Exams</h3>
               <p className="text-slate-500 text-sm">View scheduled exam dates and syllabus.</p>
            </Link>
            <Link href="/exams" className="group p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm hover:border-indigo-300 transition-colors">
               <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-2 group-hover:text-indigo-600">Free Mock Tests</h3>
               <p className="text-indigo-600/70 text-sm">Start a free practice test instantly.</p>
            </Link>
          </div>
        </section>

        {/* UPDATES HUB (RESULTS, ADMISSIONS, ADMIT CARDS, SCHOLARSHIPS, TENDERS) */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="text-purple-600 dark:text-purple-400" /> Latest Updates
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Results, Admit Cards, Scholarships and Tenders.</p>
            </div>
            <Link href="/updates" className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 backdrop-blur-md font-bold text-sm hover:bg-purple-500/20 hover:scale-105 transition-all flex items-center gap-1 hidden sm:flex shadow-sm">
              View All Updates <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
             
             {/* RESULTS */}
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                   <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">Results</h3>
                   <Link href="/updates#results" className="text-xs font-bold text-slate-500 hover:text-purple-600 uppercase">More</Link>
                </div>
                <div className="space-y-4">
                   {recentResults?.map(res => <ResultCard key={res.id} result={res} />)}
                   {(!recentResults || recentResults.length === 0) && <div className="text-sm text-slate-500 italic py-4">No recent results.</div>}
                </div>
             </div>

             {/* ADMIT CARDS */}
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                   <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">Admit Cards</h3>
                   <Link href="/updates#admit-cards" className="text-xs font-bold text-slate-500 hover:text-purple-600 uppercase">More</Link>
                </div>
                <div className="space-y-4">
                   {recentAdmitCards?.map(adm => <AdmitCard key={adm.id} admitCard={adm} />)}
                   {(!recentAdmitCards || recentAdmitCards.length === 0) && <div className="text-sm text-slate-500 italic py-4">No recent admit cards.</div>}
                </div>
             </div>

             {/* ADMISSIONS */}
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                   <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">Admissions</h3>
                   <Link href="/updates#admissions" className="text-xs font-bold text-slate-500 hover:text-purple-600 uppercase">More</Link>
                </div>
                <div className="space-y-4">
                   {recentAdmissions?.map(adm => <AdmissionCard key={adm.id} admission={adm} />)}
                   {(!recentAdmissions || recentAdmissions.length === 0) && <div className="text-sm text-slate-500 italic py-4">No recent admissions.</div>}
                </div>
             </div>

             {/* SCHOLARSHIPS & TENDERS (Combined column for space) */}
             <div className="space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                     <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">Scholarships</h3>
                     <Link href="/updates#scholarships" className="text-xs font-bold text-slate-500 hover:text-purple-600 uppercase">More</Link>
                  </div>
                  <div className="space-y-4">
                     {scholarships?.map(sch => <ScholarshipCard key={sch.id} scholarship={sch} />)}
                     {(!scholarships || scholarships.length === 0) && <div className="text-sm text-slate-500 italic py-4">No recent scholarships.</div>}
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                     <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">Tenders</h3>
                     <Link href="/updates#tenders" className="text-xs font-bold text-slate-500 hover:text-purple-600 uppercase">More</Link>
                  </div>
                  <div className="space-y-4">
                     {latestTenders?.map(tender => <TenderCard key={tender.id} tender={tender} />)}
                     {(!latestTenders || latestTenders.length === 0) && <div className="text-sm text-slate-500 italic py-4">No recent tenders.</div>}
                  </div>
               </div>
             </div>

          </div>
        </section>

        <SubscribeForm />

      </main>
    </div>
  );
}


