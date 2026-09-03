
import PageHeader from "@/components/PageHeader";
import JobCard from "@/components/JobCard";
import AdSidebar from "@/components/AdSidebar";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Briefcase, Building2 } from "lucide-react";

export const revalidate = 60;

export default async function JobsPage(props: { searchParams?: Promise<{ page?: string, type?: string, q?: string }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page || "1", 10);
  const typeFilter = searchParams?.type || "ALL";
  const query = searchParams?.q || "";
  
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let queryBuilder = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (typeFilter !== "ALL") {
    queryBuilder = queryBuilder.eq('job_type', typeFilter);
  }

  if (query) {
    // Basic ilike search for now, could be switched to RPC
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,organization.ilike.%${query}%`);
  }

  const { data: jobs, count } = await queryBuilder;
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Discover Jobs" subtitle="Find the latest Government and Private jobs in Assam." theme="blue" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1">
           {/* Controls: Search and Filters */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              {/* Type Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
                 <Link href={`/jobs?type=ALL&q=${query}`} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${typeFilter === 'ALL' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                    All Jobs
                 </Link>
                 <Link href={`/jobs?type=GOVERNMENT&q=${query}`} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${typeFilter === 'GOVERNMENT' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                    <Briefcase size={16}/> Govt
                 </Link>
                 <Link href={`/jobs?type=PRIVATE&q=${query}`} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${typeFilter === 'PRIVATE' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                    <Building2 size={16}/> Private
                 </Link>
              </div>

              {/* Form Search (Server Side) */}
              <form action="/jobs" className="relative w-full sm:w-72">
                 <input type="hidden" name="type" value={typeFilter} />
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                    type="text" 
                    name="q" 
                    defaultValue={query}
                    placeholder="Search jobs, organizations..." 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                 />
              </form>
           </div>

           {/* Results List */}
           <div className="space-y-4">
              {jobs?.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
              
              {(!jobs || jobs.length === 0) && (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Search className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No jobs found</h3>
                  <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search terms.</p>
                </div>
              )}
           </div>

           {/* Server-Side Pagination */}
           {totalPages > 1 && (
             <div className="mt-8 flex justify-center items-center gap-2">
                <Link 
                   href={`/jobs?page=${Math.max(1, page - 1)}&type=${typeFilter}&q=${query}`}
                   className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${page <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                   <ChevronLeft size={20} />
                </Link>
                <div className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                   Page {page} of {totalPages}
                </div>
                <Link 
                   href={`/jobs?page=${Math.min(totalPages, page + 1)}&type=${typeFilter}&q=${query}`}
                   className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${page >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                >
                   <ChevronRight size={20} />
                </Link>
             </div>
           )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
           <AdSidebar />
        </div>
      </main>
    </div>
  );
}
