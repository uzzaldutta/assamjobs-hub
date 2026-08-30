import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookOpen, Clock, FileText, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import FeedList from "@/components/FeedList";
import RecentMarquee from "@/components/RecentMarquee";

export const revalidate = 60; // ISR cache

export default async function StudyMaterialsLibrary() {
  // 1. Fetch AI Generated Study Materials
  const { data: aiMaterials } = await supabase
    .from('jobs')
    .select('id, title, created_at')
    .eq('category', 'STUDY_MATERIAL')
    .order('created_at', { ascending: false });

  // 2. Fetch Manual PDFs (Old System)
  let manualPdfs: any[] = [];
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', 'STUDY_MATERIAL')
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

      <div className="flex justify-center -mt-16 mb-8 relative z-20">
        <Link href="/study-materials/ai-generator" className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-bold py-2 px-6 rounded-full shadow-sm hover:shadow-md transition flex items-center gap-2">
          <BookOpen size={18} />
          Generate AI Study Guide
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 relative z-10">
        
        {/* Section 1: AI Materials */}
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <BookOpen className="text-blue-500" /> AI Generated Guides
        </h3>
        
        {!aiMaterials || aiMaterials.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 mb-12">
            <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 mb-4">No AI study materials generated yet.</p>
            <Link href="/study-materials/ai-generator" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-blue-700 transition">
              Generate Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {aiMaterials.map(mat => (
              <Link key={mat.id} href={`/study-materials/${mat.id}`} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-lg transition group">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                  <FileText size={24} />
                </div>
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
          <FeedList initialJobs={manualPdfs} defaultFilter="STUDY_MATERIAL" hideFilters={true} />
        </div>

      </div>
    </div>
  );
}
