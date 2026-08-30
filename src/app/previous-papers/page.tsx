import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Clock, FileText, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import FeedList from "@/components/FeedList";
import RecentMarquee from "@/components/RecentMarquee";

export const revalidate = 60; // ISR cache

export default async function PreviousPapersLibrary({ searchParams }: { searchParams: Promise<{ q?: string, subject?: string }> }) {
  const { q, subject } = await searchParams;
  const query = q ? q.toLowerCase() : "";
  const activeSubject = subject || "ALL";
  // 1. Fetch AI Generated Study Materials
  let { data: aiMaterials } = await supabase
    .from('jobs')
    .select('id, title, created_at, job_type')
    .eq('category', 'PREVIOUS_PAPERS')
    .order('created_at', { ascending: false });
  if (aiMaterials) {
    if (query) {
      aiMaterials = aiMaterials.filter((m: any) => (m.title || "").toLowerCase().includes(query));
    }
    if (activeSubject !== "ALL") {
      aiMaterials = aiMaterials.filter((m: any) => m.job_type === activeSubject);
    }
  }


  // 2. Fetch Manual PDFs (Old System)
  let manualPdfs: any[] = [];
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', 'PREVIOUS_PAPERS')
      .order('scraped_at', { ascending: false });
      
    if (data) {
      manualPdfs = data.map(job => ({
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PageHeader 
        title="Study Materials & PDFs" 
        subtitle="Browse AI-generated study guides and download official syllabus PDFs."
        theme="blue"
      />

      <div className="flex justify-center mt-4 mb-8 relative z-20">
        <Link href="/jobs/ai-generator" className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-bold py-2 px-6 rounded-full shadow-sm hover:shadow-md transition flex items-center gap-2">
          <FileText size={18} />
          Generate AI Study Guide
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 relative z-10">
        
        {/* Section 1: AI Materials */}
        <form action="/jobs" method="GET" className="mb-8 relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            name="q" 
            defaultValue={query} 
            placeholder="Search study materials by exam or topic..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button type="submit" className="absolute right-2 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg font-bold text-sm">Search</button>
        </form>

        <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="mb-8 overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex gap-2 w-max">
            <Link href="/jobs" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>All Subjects</Link>
            <Link href="/jobs?subject=HISTORY" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'HISTORY' ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>History</Link>
            <Link href="/jobs?subject=POLITY" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'POLITY' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Polity & Governance</Link>
            <Link href="/jobs?subject=ECONOMICS" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'ECONOMICS' ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Economics</Link>
            <Link href="/jobs?subject=GEOGRAPHY" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'GEOGRAPHY' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Geography</Link>
            <Link href="/jobs?subject=GENERAL_SCIENCE" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'GENERAL_SCIENCE' ? 'bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>General Science</Link>
            <Link href="/jobs?subject=ASSAM_GK" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'ASSAM_GK' ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Assam GK</Link>
            <Link href="/jobs?subject=MATH_REASONING" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'MATH_REASONING' ? 'bg-violet-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Math & Reasoning</Link>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <FileText className="text-blue-500" /> Previous Year Question Papers
        </h3>
        
        {!aiMaterials || aiMaterials.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 mb-12">
            <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 mb-4">No interactive study books found. Use the Admin Panel to add some!</p>
            <Link href="/jobs/ai-generator" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-blue-700 transition">
              Generate Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {aiMaterials.map(mat => (
              <Link key={mat.id} href={`/jobs/${mat.id}`} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-lg transition group">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                  <FileText size={24} />
                </div>
                <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-md mb-3">
                  {mat.job_type?.replace('_', ' ') || 'STUDY GUIDE'}
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">
                  {mat.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                  <span className="flex items-center gap-1"><Clock size={14}/> Quick Read</span>
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Read Guide <ArrowRight size={16} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}

        <hr className="border-slate-200 dark:border-slate-800 my-10" />

        {/* Section 2: Manual PDFs (Old System) */}
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <FileText className="text-fuchsia-500" /> Official PDFs & Syllabus
        </h3>
        
        {manualPdfs.length > 0 && <RecentMarquee jobs={manualPdfs.slice(0, 8)} title="Recent Uploads" />}
        
        <div className="mt-6">
          <FeedList initialJobs={manualPdfs} defaultFilter="PREVIOUS_PAPERS" hideFilters={true} />
        </div>

      </div>
    </div>
  );
}
