code = """
import PageHeader from "@/components/PageHeader";
import AdSidebar from "@/components/AdSidebar";
import ResultCard from "@/components/feeds/ResultCard";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Award } from "lucide-react";

export const revalidate = 60;

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { page?: string, search?: string }
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;
  const search = searchParams.search || "";

  let query = supabase
    .from('results')
    .select('*', { count: 'exact' })
    .eq('status', 'PUBLISHED')
    .order('result_date', { ascending: false }); // Newest result first

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data: results, count } = await query.range(offset, offset + limit - 1);
  const totalCount = count || 0;
  const hasNext = (offset + limit) < totalCount;
  const hasPrevious = page > 1;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PageHeader 
        title="Exam Results" 
        subtitle="Latest recruitment and competitive exam results in Assam"
        theme="blue"
      />
      
      <div className="px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col space-y-6">
            
            <form className="flex gap-2">
              <input 
                type="text" 
                name="search" 
                defaultValue={search} 
                placeholder="Search results by exam or organization..." 
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              />
              <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition">
                Search
              </button>
            </form>

            {!results || results.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
                <Award size={48} className="mx-auto text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">No results found</h2>
                <p className="text-slate-500 mt-2">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((res: any) => (
                  <ResultCard key={res.id} result={res} />
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              {hasPrevious ? (
                 <Link href={`/results?page=${page - 1}${search ? `&search=${search}` : ''}`} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
                    &larr; Previous
                 </Link>
              ) : <div/>}
              
              <span className="text-sm font-medium text-slate-500">Page {page} of {Math.max(1, Math.ceil(totalCount / limit))}</span>
              
              {hasNext ? (
                 <Link href={`/results?page=${page + 1}${search ? `&search=${search}` : ''}`} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
                    Next &rarr;
                 </Link>
              ) : <div/>}
            </div>

          </div>
          <AdSidebar />
        </div>
      </div>
    </div>
  );
}
"""

with open("src/app/results/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
