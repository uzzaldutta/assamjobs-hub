
import PageHeader from "@/components/PageHeader";
import JobCard from "@/components/JobCard";
import AdSidebar from "@/components/AdSidebar";
import JobsFilterPanel from "./JobsFilterPanel";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Briefcase, Building2, SlidersHorizontal } from "lucide-react";

export const revalidate = 60;

export default async function JobsPage(props: { searchParams?: Promise<{ [key: string]: string }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page || "1", 10);
  const typeFilter = searchParams?.type || "ALL";
  const query = searchParams?.q || "";
  const district = searchParams?.district || "";
  const qualification = searchParams?.qualification || "";
  const organization = searchParams?.organization || "";
  const status = searchParams?.status || "ALL"; // ACTIVE, CLOSING_SOON, CLOSED
  const sort = searchParams?.sort || "newest"; // newest, deadline
  
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let queryBuilder = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('status', 'PUBLISHED');

  // FILTERS
  if (typeFilter !== "ALL") {
    queryBuilder = queryBuilder.eq('job_type', typeFilter);
  }
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,organization.ilike.%${query}%`);
  }
  if (district) {
    queryBuilder = queryBuilder.ilike('district', `%${district}%`);
  }
  if (qualification) {
    queryBuilder = queryBuilder.ilike('qualification', `%${qualification}%`);
  }
  if (organization) {
    queryBuilder = queryBuilder.ilike('organization', `%${organization}%`);
  }

  // STATUS LOGIC (ACTIVE / CLOSING SOON / CLOSED)
  const now = new Date().toISOString();
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  if (status === "ACTIVE") {
    queryBuilder = queryBuilder.gte('application_end', now);
  } else if (status === "CLOSING_SOON") {
    queryBuilder = queryBuilder.gte('application_end', now).lte('application_end', nextWeek);
  } else if (status === "CLOSED") {
    queryBuilder = queryBuilder.lt('application_end', now);
  }

  // SORTING LOGIC
  if (sort === "deadline") {
    // Only sort by deadline if it's active/closing soon so we see closest first
    queryBuilder = queryBuilder.order('application_end', { ascending: true, nullsFirst: false });
  } else {
    queryBuilder = queryBuilder.order('created_at', { ascending: false });
  }

  queryBuilder = queryBuilder.range(from, to);

  const { data: jobs, count, error } = await queryBuilder;
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Discover Jobs" subtitle="Find the latest Government and Private jobs in Assam." theme="blue" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Advanced Filters (Sidebar / Mobile Drawer) */}
        <div className="w-full lg:w-72 shrink-0">
           <JobsFilterPanel 
              currentFilters={{
                 q: query,
                 type: typeFilter,
                 district,
                 qualification,
                 organization,
                 status,
                 sort
              }}
              totalCount={totalCount}
           />
           <div className="hidden lg:block mt-6">
             <AdSidebar />
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
           {/* Results List */}
           <div className="space-y-4">
              {jobs?.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
              
              {(!jobs || jobs.length === 0) && (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Search className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No jobs found</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your filters or search terms.</p>
                  <Link href="/jobs" className="px-6 py-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 transition-colors">
                    Clear All Filters
                  </Link>
                </div>
              )}
           </div>

           {/* Server-Side Pagination */}
           {totalPages > 1 && (
             <div className="mt-8 flex justify-center items-center gap-2">
                <Link 
                   href={`/jobs?page=${Math.max(1, page - 1)}&type=${typeFilter}&q=${query}&district=${district}&qualification=${qualification}&organization=${organization}&status=${status}&sort=${sort}`}
                   className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${page <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                   <ChevronLeft size={20} />
                </Link>
                <div className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                   Page {page} of {totalPages}
                </div>
                <Link 
                   href={`/jobs?page=${Math.min(totalPages, page + 1)}&type=${typeFilter}&q=${query}&district=${district}&qualification=${qualification}&organization=${organization}&status=${status}&sort=${sort}`}
                   className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${page >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                >
                   <ChevronRight size={20} />
                </Link>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
