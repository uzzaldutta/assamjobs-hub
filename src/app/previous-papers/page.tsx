import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Clock, FileText, ArrowRight, BookOpen, Layers } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import FeedList from "@/components/FeedList";
import RecentMarquee from "@/components/RecentMarquee";

export const revalidate = 86400; // 24h caching - On-demand revalidation

export default async function PreviousPapersLibrary({ searchParams }: { searchParams: Promise<{ q?: string, subject?: string }> }) {
  const { q, subject } = await searchParams;
  const query = q ? q.toLowerCase() : "";
  const activeSubject = subject || "ALL";

  // 1. Fetch published study guides and papers from prep_materials
  let { data: prepMaterials } = await supabase
    .from('prep_materials')
    .select('id, title, created_at, type')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false });

  // 2. Fetch manual PDFs / jobs categorized as PREVIOUS_PAPERS
  let { data: legacyJobs } = await supabase
    .from('jobs')
    .select('id, title, created_at, job_type, official_pdf_url, apply_url, last_date, scraped_at')
    .or('category.eq.PREVIOUS_PAPERS,job_type.eq.PREVIOUS_PAPERS')
    .order('scraped_at', { ascending: false });

  // Unify materials
  let allMaterials: Array<{ id: string; title: string; type: string; url: string; createdAt: string }> = [];

  if (prepMaterials && prepMaterials.length > 0) {
    prepMaterials.forEach(m => {
      allMaterials.push({
        id: m.id,
        title: m.title,
        type: m.type || 'STUDY GUIDE',
        url: `/study-materials/${m.id}`,
        createdAt: new Date(m.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    });
  }

  if (legacyJobs && legacyJobs.length > 0) {
    legacyJobs.forEach(j => {
      allMaterials.push({
        id: j.id,
        title: j.title,
        type: j.job_type || 'PREVIOUS PAPER',
        url: `/jobs/${j.id}`,
        createdAt: new Date(j.scraped_at || j.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    });
  }

  // Filter by search query
  if (query) {
    allMaterials = allMaterials.filter(m => m.title.toLowerCase().includes(query));
  }

  // Filter by subject tag
  if (activeSubject !== "ALL") {
    allMaterials = allMaterials.filter(m => m.title.toLowerCase().includes(activeSubject.toLowerCase()) || m.type.toLowerCase().includes(activeSubject.toLowerCase()));
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PageHeader 
        title="Previous Question Papers & Guides" 
        subtitle="Download official previous papers, exam syllabi, and study notes for Assam competitive exams."
        theme="blue"
      />

      <div className="max-w-7xl mx-auto px-4 mt-8 relative z-10">
        
        {/* Search Bar */}
        <form action="/previous-papers" method="GET" className="mb-8 relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            name="q" 
            defaultValue={query} 
            placeholder="Search papers by exam (e.g. ADRE, Police, APSC)..." 
            className="w-full pl-12 pr-28 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white"
          />
          <button type="submit" className="absolute right-2 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg font-bold text-sm transition-colors">
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 w-max mx-auto">
            <Link href="/previous-papers" className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>All Papers</Link>
            <Link href="/previous-papers?subject=ADRE" className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'ADRE' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>ADRE 2.0</Link>
            <Link href="/previous-papers?subject=Police" className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'Police' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Assam Police</Link>
            <Link href="/previous-papers?subject=APSC" className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'APSC' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>APSC CCE</Link>
            <Link href="/previous-papers?subject=TET" className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'TET' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Assam TET</Link>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <FileText className="text-blue-500" /> Available Question Papers & Syllabus Guides
        </h3>
        
        {allMaterials.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 mb-12">
            <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">No question papers found matching your search.</p>
            <Link href="/previous-papers" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition">
              View All Papers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {allMaterials.map(mat => (
              <Link key={mat.id} href={mat.url} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-lg transition group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                    <BookOpen size={24} />
                  </div>
                  <span className="inline-block px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded-md mb-3 border border-blue-200 dark:border-blue-800">
                    {mat.type.replace('_', ' ')}
                  </span>
                  <h4 className="text-base md:text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">
                    {mat.title}
                  </h4>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Clock size={13}/> {mat.createdAt}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center group-hover:translate-x-1 transition-transform">
                    View Paper &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
