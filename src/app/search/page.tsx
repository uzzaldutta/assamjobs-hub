import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import PageHeader from '@/components/PageHeader';
import { Search, AlertCircle } from 'lucide-react';

export const revalidate = 60;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || "";

  let results: any[] = [];
  
  if (query.trim().length > 0) {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .or(`title.ilike.%${query}%,organization.ilike.%${query}%`)
      .order('scraped_at', { ascending: false })
      .limit(50);
      
    if (data) {
      results = data.map((job: any) => ({
        ...job,
        type: job.job_type,
        lastDate: job.last_date,
        createdAt: new Date(job.scraped_at || job.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      }));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PageHeader 
        title="Search Results" 
        subtitle={query ? `Showing results for "${query}"` : "Enter a search term to find jobs, exams, and materials."}
        theme="purple"
      />

      <div className="max-w-4xl mx-auto px-4 mt-8 relative z-10">
        
        <form className="relative w-full mb-10" action="/search" method="GET">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search jobs, exams, or organizations..."
            className="block w-full pl-12 pr-24 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm text-lg"
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 rounded-xl transition">
            Search
          </button>
        </form>

        {query.trim().length > 0 && results.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <AlertCircle size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No results found</h3>
            <p className="text-slate-500 mb-6">We couldn't find any matches for "{query}". Try different keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}