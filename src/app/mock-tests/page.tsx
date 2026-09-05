
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { Search, Activity, FileCheck, ArrowRight, Clock, Hash } from "lucide-react";

export const revalidate = 60;

export default async function MockTestsPage(props: { searchParams?: Promise<{ [key: string]: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  const sort = searchParams?.sort || "newest";

  let queryBuilder = supabase
    .from('prep_mock_tests')
    .select('*, prep_exams(title)')
    .eq('status', 'PUBLISHED');

  if (q) queryBuilder = queryBuilder.ilike('title', `%${q}%`);
  
  if (sort === 'newest') {
    queryBuilder = queryBuilder.order('created_at', { ascending: false });
  } else {
    queryBuilder = queryBuilder.order('title', { ascending: true });
  }

  const { data: tests, error } = await queryBuilder;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <PageHeader 
        title="Mock Tests & Practice" 
        subtitle="Free full-length mock tests for Assam Govt exams." 
        theme="purple" 
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <form action="/mock-tests" className="flex flex-col sm:flex-row gap-4 max-w-2xl bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1">
              <input 
                type="text" 
                name="q" 
                defaultValue={q} 
                placeholder="Search mock tests by name..." 
                className="w-full bg-transparent py-3 pl-12 pr-4 text-slate-900 dark:text-white outline-none font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests?.map((test: any) => (
            <Link 
              href={`/mock-tests/${test.id}`} 
              key={test.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col group"
            >
              <div className="mb-4">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                  Mock Test
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {test.title}
              </h3>
              
              {test.prep_exams && (
                <p className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-1.5">
                  <FileCheck size={16} className="text-slate-400" />
                  {test.prep_exams.title}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                   <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</span>
                   <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> {test.duration_minutes || '--'} Mins</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                   <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Marks</span>
                   <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><Hash size={14} className="text-slate-400"/> {test.total_marks || '--'} Marks</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">View Details</span>
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors text-indigo-600 dark:text-indigo-400">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!tests || tests.length === 0) && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <Activity size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Mock Tests Available</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">We are adding new mock tests soon. Check back later!</p>
            {q && (
              <Link href="/mock-tests" className="inline-block px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors">
                Clear Search
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
