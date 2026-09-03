code = """
import HeroSection from "@/components/HeroSection";
import SubscribeForm from "@/components/SubscribeForm";
import JobCard from "@/components/feeds/JobCard";
import TenderCard from "@/components/feeds/TenderCard";
import AdmissionCard from "@/components/feeds/AdmissionCard";
import ResultCard from "@/components/feeds/ResultCard";
import AdmitCard from "@/components/feeds/AdmitCard";
import ScholarshipCard from "@/components/feeds/ScholarshipCard";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Briefcase, GraduationCap, FileText, Bell, Award, FileCheck } from "lucide-react";

export const revalidate = 60; // 1 minute cache

export default async function Home() {
  // Fetch Latest Jobs (Govt vs Private)
  // Assuming tier 1 official + govt sources are classified, or we split them if we have 'is_government'
  const { data: latestJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false })
    .limit(6);

  // Fetch Closing Soon Jobs
  const { data: closingSoonJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'PUBLISHED')
    .gte('application_end', new Date().toISOString())
    .lte('application_end', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('application_end', { ascending: true })
    .limit(6);

  // Fetch Latest Updates (Results, Admit Cards, Admissions)
  const { data: recentResults } = await supabase.from('results').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);
  const { data: recentAdmitCards } = await supabase.from('admit_cards').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);
  const { data: recentAdmissions } = await supabase.from('admissions').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);

  // Fetch Latest Tenders
  const { data: latestTenders } = await supabase.from('tenders').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(4);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        
        {/* LATEST JOBS SECTION */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="text-indigo-600 dark:text-indigo-400" /> Latest Jobs
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Recently verified recruitment notifications.</p>
            </div>
            <Link href="/jobs" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold flex items-center gap-1 text-sm hidden sm:flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestJobs?.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
            {(!latestJobs || latestJobs.length === 0) && (
              <div className="col-span-full py-12 text-center text-slate-500">No recent jobs found.</div>
            )}
          </div>
          <div className="mt-6 sm:hidden text-center">
            <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-bold rounded-xl w-full justify-center">
              View All Jobs <ArrowRight size={18} />
            </Link>
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {closingSoonJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* UPDATES HUB (RESULTS, ADMISSIONS, ADMIT CARDS) */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="text-emerald-600 dark:text-emerald-400" /> Latest Updates
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Results, Admit Cards, and Admissions.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
             
             {/* RESULTS */}
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                   <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2"><Award size={18} className="text-fuchsia-500"/> Results</h3>
                   <Link href="/results" className="text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase">View All</Link>
                </div>
                <div className="space-y-4">
                   {recentResults?.map(res => (
                      <ResultCard key={res.id} data={res} compact={true} />
                   ))}
                   {(!recentResults || recentResults.length === 0) && <div className="text-sm text-slate-500 italic py-4">No recent results.</div>}
                </div>
             </div>

             {/* ADMIT CARDS */}
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                   <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2"><FileText size={18} className="text-blue-500"/> Admit Cards</h3>
                   <Link href="/admit-cards" className="text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase">View All</Link>
                </div>
                <div className="space-y-4">
                   {recentAdmitCards?.map(adm => (
                      <AdmitCard key={adm.id} data={adm} compact={true} />
                   ))}
                   {(!recentAdmitCards || recentAdmitCards.length === 0) && <div className="text-sm text-slate-500 italic py-4">No recent admit cards.</div>}
                </div>
             </div>

             {/* ADMISSIONS */}
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                   <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2"><GraduationCap size={18} className="text-emerald-500"/> Admissions</h3>
                   <Link href="/admissions" className="text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase">View All</Link>
                </div>
                <div className="space-y-4">
                   {recentAdmissions?.map(adm => (
                      <AdmissionCard key={adm.id} data={adm} compact={true} />
                   ))}
                   {(!recentAdmissions || recentAdmissions.length === 0) && <div className="text-sm text-slate-500 italic py-4">No recent admissions.</div>}
                </div>
             </div>

          </div>
        </section>

        {/* TENDERS SECTION */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="text-slate-600 dark:text-slate-400" /> Govt Tenders
              </h2>
            </div>
            <Link href="/tenders" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold flex items-center gap-1 text-sm hidden sm:flex">
              All Tenders <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {latestTenders?.map(tender => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
            {(!latestTenders || latestTenders.length === 0) && (
              <div className="col-span-full py-12 text-center text-slate-500">No recent tenders found.</div>
            )}
          </div>
        </section>

        <SubscribeForm />

      </main>
    </div>
  );
}
"""
with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
