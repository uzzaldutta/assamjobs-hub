
import PageHeader from "@/components/PageHeader";
import AdSidebar from "@/components/AdSidebar";
import AdmitCard from "@/components/feeds/AdmitCard";
import FilterDrawer from "@/components/FilterDrawer";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Admit Cards",
  description: "Download admit cards for Assam Police, APSC, ADRE and other exams.",
  alternates: {
    canonical: "/admit-cards",
  }
};

export default async function AdmitCardsPage(props: { searchParams?: Promise<{ [key: string]: string }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page || "1");
  const q = searchParams?.q || "";
  const org = searchParams?.org || "";
  const sort = searchParams?.sort || "newest";

  const limit = 20;
  const offset = (page - 1) * limit;

  let queryBuilder = supabase
    .from('admit_cards')
    .select('*', { count: 'exact' })
    .eq('status', 'PUBLISHED');

  if (q) queryBuilder = queryBuilder.ilike('title', `%${q}%`);
  if (org) queryBuilder = queryBuilder.ilike('organization', `%${org}%`);

  if (sort === "exam_date") {
    queryBuilder = queryBuilder.order('exam_date', { ascending: false, nullsFirst: false });
  } else {
    queryBuilder = queryBuilder.order('created_at', { ascending: false });
  }

  const { data: admitCards, count } = await queryBuilder.range(offset, offset + limit - 1);
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Admit Cards" subtitle="Download latest admit cards and call letters for exams and interviews." theme="blue" />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-72 shrink-0">
           <FilterDrawer totalCount={totalCount}>
             <form action="/admit-cards" className="flex flex-col space-y-6 lg:bg-transparent lg:border-none rounded-2xl border-slate-200">
               <div className="hidden lg:block pb-4 border-b border-slate-200 dark:border-slate-800">
                 <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                   <SlidersHorizontal size={20} className="text-blue-600" /> Filters
                 </h3>
                 <p className="text-sm text-slate-500 font-medium">{totalCount} admit cards found</p>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Search</label>
                 <div className="relative">
                   <input type="text" name="q" defaultValue={q} placeholder="Exam name..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 outline-none transition-colors dark:text-white" />
                   <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Organization</label>
                 <input type="text" name="org" defaultValue={org} placeholder="e.g. SLPRB, APSC..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm focus:border-blue-500 outline-none transition-colors dark:text-white" />
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sort By</label>
                 <select name="sort" defaultValue={sort} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-sm focus:border-blue-500 outline-none transition-colors dark:text-white font-medium appearance-none">
                   <option value="newest">Newly Added</option>
                   <option value="exam_date">Exam Date (Latest)</option>
                 </select>
               </div>

               <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                 <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm">Apply Filters</button>
                 <Link href="/admit-cards" className="w-full text-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-colors">Clear All</Link>
               </div>
             </form>
           </FilterDrawer>
           <div className="hidden lg:block mt-6">
             <AdSidebar />
           </div>
        </div>

        <div className="flex-1 space-y-4">
          {admitCards?.map(adm => (
            <AdmitCard key={adm.id} admitCard={adm} />
          ))}
                    {(!admitCards || admitCards.length === 0) && (() => {
            const hasFilters = q || org || sort !== 'newest';
            return (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Search className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {hasFilters ? "No admit cards match these filters." : "No admit cards available right now."}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  {hasFilters ? "Try adjusting your filters or search terms." : "Check back later for new updates."}
                </p>
                {hasFilters && (
                  <Link href="/admit-cards" className="inline-block px-6 py-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 transition-colors">
                    Clear All Filters
                  </Link>
                )}
              </div>
            );
          })()}          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
               <Link href={`/admit-cards?page=${Math.max(1, page - 1)}&q=${q}&org=${org}&sort=${sort}`} className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 ${page <= 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                 <ChevronLeft size={20} />
               </Link>
               <div className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300">Page {page} of {totalPages}</div>
               <Link href={`/admit-cards?page=${Math.min(totalPages, page + 1)}&q=${q}&org=${org}&sort=${sort}`} className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 ${page >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}>
                 <ChevronRight size={20} />
               </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

