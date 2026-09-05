
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { Search, FileText, FileCheck, ArrowRight, BookOpen } from "lucide-react";

export const revalidate = 60;

export default async function StudyMaterialsPage(props: { searchParams?: Promise<{ [key: string]: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  const sort = searchParams?.sort || "newest";

  let queryBuilder = supabase
    .from('prep_materials')
    .select('*, prep_exams(title)')
    .eq('status', 'PUBLISHED');

  if (q) queryBuilder = queryBuilder.ilike('title', `%${q}%`);
  
  if (sort === 'newest') {
    queryBuilder = queryBuilder.order('created_at', { ascending: false });
  } else {
    queryBuilder = queryBuilder.order('title', { ascending: true });
  }

  const { data: materials, error } = await queryBuilder;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <PageHeader 
        title="Study Materials" 
        subtitle="PDF notes, previous year papers, and syllabus guides." 
        theme="green" 
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <form action="/study-materials" className="flex flex-col sm:flex-row gap-4 max-w-2xl bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1">
              <input 
                type="text" 
                name="q" 
                defaultValue={q} 
                placeholder="Search materials by topic or exam..." 
                className="w-full bg-transparent py-3 pl-12 pr-4 text-slate-900 dark:text-white outline-none font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials?.map((material: any) => (
            <Link 
              href={`/study-materials/${material.id}`} 
              key={material.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-700 transition-all flex flex-col group"
            >
              <div className="mb-4">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-100 dark:border-teal-800">
                  {material.type || 'Material'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                {material.title}
              </h3>
              
              {material.prep_exams && (
                <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-1.5">
                  <FileCheck size={16} className="text-slate-400" />
                  {material.prep_exams.title}
                </p>
              )}
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center mt-auto">
                <span className="text-teal-600 dark:text-teal-400 font-bold text-sm flex items-center gap-1"><BookOpen size={16} /> Read Now</span>
                <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors text-teal-600 dark:text-teal-400">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!materials || materials.length === 0) && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Study Materials Found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">We couldn't find any materials matching your criteria.</p>
            {q && (
              <Link href="/study-materials" className="inline-block px-6 py-2.5 bg-teal-50 text-teal-600 font-bold rounded-xl hover:bg-teal-100 transition-colors">
                Clear Search
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
