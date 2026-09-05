
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { Search, BookOpen, ArrowRight, Layers } from "lucide-react";

export const revalidate = 60;

export default async function SyllabusPage(props: { searchParams?: Promise<{ [key: string]: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";

  let queryBuilder = supabase
    .from('prep_exams')
    .select('*, prep_subjects(id)')
    .eq('status', 'PUBLISHED');

  if (q) queryBuilder = queryBuilder.ilike('title', `%${q}%`);
  
  queryBuilder = queryBuilder.order('created_at', { ascending: false });

  const { data: exams, error } = await queryBuilder;
  
  // Only show exams that have syllabus (prep_subjects) mapped, or show all? 
  // Let's show all published exams so users know the exam exists, but we can highlight if syllabus is mapped.
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <PageHeader 
        title="Official Syllabus" 
        subtitle="Detailed topic-wise syllabus for Assam Govt exams." 
        theme="purple" 
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <form action="/syllabus" className="flex flex-col sm:flex-row gap-4 max-w-2xl bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1">
              <input 
                type="text" 
                name="q" 
                defaultValue={q} 
                placeholder="Search syllabus by exam name..." 
                className="w-full bg-transparent py-3 pl-12 pr-4 text-slate-900 dark:text-white outline-none font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
            <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams?.map((exam: any) => {
             const hasSyllabus = exam.prep_subjects && exam.prep_subjects.length > 0;
             return (
              <Link 
                href={`/exam/${exam.slug}`} 
                key={exam.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all flex flex-col group"
              >
                <div className="mb-4 flex justify-between items-start">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border border-violet-100 dark:border-violet-800">
                    Syllabus
                  </span>
                  {hasSyllabus ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400">Available</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">Compiling</span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                  {exam.title}
                </h3>
                
                <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-2">
                  {exam.description || "Detailed syllabus and preparation strategy."}
                </p>
                
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center mt-auto">
                  <span className="text-violet-600 dark:text-violet-400 font-bold text-sm flex items-center gap-1"><BookOpen size={16} /> View Syllabus</span>
                  <div className="w-8 h-8 rounded-full bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors text-violet-600 dark:text-violet-400">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {(!exams || exams.length === 0) && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <Layers size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Syllabus Found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">We couldn't find any syllabus matching your search.</p>
            {q && (
              <Link href="/syllabus" className="inline-block px-6 py-2.5 bg-violet-50 text-violet-600 font-bold rounded-xl hover:bg-violet-100 transition-colors">
                Clear Search
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
