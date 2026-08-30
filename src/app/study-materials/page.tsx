import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookOpen, Clock, FileText, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export const revalidate = 60; // ISR cache

export default async function StudyMaterialsLibrary() {
  const { data: materials, error } = await supabase
    .from('jobs')
    .select('id, title, created_at')
    .eq('category', 'STUDY_MATERIAL')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PageHeader 
        title="Study Materials Library" 
        subtitle="Browse concise, high-yield study guides generated for quick revision."
        theme="blue"
      />

      <div className="flex justify-center -mt-16 mb-8 relative z-20">
        <Link href="/study-materials/ai-generator" className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 font-bold py-2 px-6 rounded-full shadow-sm hover:shadow-md transition flex items-center gap-2">
          <BookOpen size={18} />
          Generate New Material
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 relative z-10">
        {!materials || materials.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No study materials found!</h3>
            <p className="text-slate-500 mb-6">Be the first to generate a quick-revision study guide.</p>
            <Link href="/study-materials/ai-generator" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition">
              Generate Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map(mat => (
              <Link key={mat.id} href={`/study-materials/${mat.id}`} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-lg transition group">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                  <FileText size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">
                  {mat.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                  <span className="flex items-center gap-1"><Clock size={14}/> Quick Read</span>
                </div>
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Read Guide <ArrowRight size={16} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
