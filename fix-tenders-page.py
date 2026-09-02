code = """
import PageHeader from "@/components/PageHeader";
import AdSidebar from "@/components/AdSidebar";
import TenderCard from "@/components/feeds/TenderCard";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FileText } from "lucide-react";

export const revalidate = 60;

export default async function TendersPage({
  searchParams,
}: {
  searchParams: { page?: string, search?: string }
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;
  const search = searchParams.search || "";

  let query = supabase
    .from('tenders')
    .select('*', { count: 'exact' })
    .eq('status', 'PUBLISHED')
    .order('closing_date', { ascending: true }); // Feed specific sorting

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data: tenders, count } = await query.range(offset, offset + limit - 1);
  const totalCount = count || 0;
  const hasNext = (offset + limit) < totalCount;
  const hasPrevious = page > 1;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PageHeader 
        title="Government Tenders" 
        subtitle="Latest e-Procurement notices and active tenders from Govt of Assam"
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
                placeholder="Search tenders by department or title..." 
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              />
              <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition">
                Search
              </button>
            </form>

            {!tenders || tenders.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
                <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">No active tenders found</h2>
                <p className="text-slate-500 mt-2">Check back later for new e-procurement notices.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tenders.map((tender: any) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              {hasPrevious ? (
                 <Link href={`/tenders?page=${page - 1}${search ? `&search=${search}` : ''}`} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
                    &larr; Previous
                 </Link>
              ) : <div/>}
              
              <span className="text-sm font-medium text-slate-500">Page {page} of {Math.max(1, Math.ceil(totalCount / limit))}</span>
              
              {hasNext ? (
                 <Link href={`/tenders?page=${page + 1}${search ? `&search=${search}` : ''}`} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
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

with open("src/app/tenders/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
