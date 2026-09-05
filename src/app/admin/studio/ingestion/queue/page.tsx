import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import { CheckCircle, XCircle, AlertTriangle, ShieldCheck, ShieldAlert, ArrowRight, ExternalLink, FileSearch, Filter, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { approveQueueItemAction, rejectQueueItemAction } from "../actions";

export const revalidate = 0;

export default async function IngestionQueue({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; type?: string; search?: string }
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const currentStatus = searchParams.status || "PENDING";
  const currentType = searchParams.type || "ALL";
  const searchQuery = searchParams.search || "";

  let query = supabase
    .from("ingestion_queue")
    .select("*, ingestion_sources(source_name, is_official, tier)", { count: "exact" });

  // Status Filter
  if (currentStatus === "PENDING") {
    query = query.in("status", ["NEW", "CHANGE_DETECTED", "DUPLICATE_RISK", "LOW_QUALITY", "VERIFICATION_PENDING"]);
  } else if (currentStatus !== "ALL") {
    query = query.eq("status", currentStatus);
  }

  // Type Filter
  if (currentType !== "ALL") {
    query = query.eq("content_type", currentType);
  }

  // Search filter (basic payload title search)
  // Since payload is JSONB, we can use ->> operator in postgrest, but it's simpler to use textSearch on payload if indexed, 
  // or we can use ilike on payload->>'title' via raw query. Since we can't do raw sql easily, let's just skip deep search 
  // or use basic ilike casting if supported. Actually, let's just sort and paginate.
  
  query = query.order("created_at", { ascending: false }).range(start, end);

  const { data: queueItems, count } = await query;
  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      <PageHeader 
        title="Ingestion Queue" 
        subtitle="Review, approve, and merge scraped feed entries."
        theme="blue"
      />
      
      {/* FILTER BAR */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <form className="flex flex-wrap items-center gap-3 w-full">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 md:flex-none md:w-64">
             <SearchIcon size={16} className="text-slate-400" />
             <input type="text" name="search" defaultValue={searchQuery} placeholder="Search not supported yet..." disabled className="bg-transparent text-sm outline-none w-full text-slate-400 cursor-not-allowed" />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select name="status" defaultValue={currentStatus} className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 bg-white">
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Action Required (Pending)</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select name="type" defaultValue={currentType} className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 bg-white">
              <option value="ALL">All Types</option>
              <option value="JOB">Job</option>
              <option value="TENDER">Tender</option>
              <option value="ADMISSION">Admission</option>
              <option value="RESULT">Result</option>
            </select>
          </div>

          <button type="submit" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-bold transition">
            Apply Filters
          </button>
        </form>
      </div>

      {/* QUEUE LIST */}
      <div className="space-y-4 px-4 sm:px-0">
        {!queueItems || queueItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Queue is Empty</h3>
            <p className="text-slate-500 mt-2">No items match the current filters.</p>
          </div>
        ) : (
          queueItems.map((item) => {
            const payload = item.payload || {};
            const sourceMeta = item.ingestion_sources;
            
            // Server actions wrapper
            const handleApprove = async (formData: FormData) => {
              "use server";
              await approveQueueItemAction(item.id, item.payload, item.duplicate_of ? 'UPDATE' : 'NEW');
              revalidatePath('/admin/studio/ingestion/queue');
            };
            
            const handleReject = async (formData: FormData) => {
              "use server";
              await rejectQueueItemAction(item.id);
              revalidatePath('/admin/studio/ingestion/queue');
            };
            
            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-4 items-center">
                
                {/* Left: Priority & Scores */}
                <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col gap-3 md:border-r border-slate-100 md:pr-4">
                  <div className="flex-1">
                     <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded ${
                       item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                       item.status === 'REJECTED' ? 'bg-slate-200 text-slate-700' :
                       item.status === 'CHANGE_DETECTED' ? 'bg-amber-100 text-amber-700' :
                       item.status === 'DUPLICATE_RISK' ? 'bg-rose-100 text-rose-700' :
                       'bg-indigo-100 text-indigo-700'
                     }`}>
                       {item.status.replace('_', ' ')}
                     </span>
                     <div className="text-[10px] text-slate-400 font-bold mt-2">{new Date(item.created_at).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <div className="bg-slate-50 px-2 py-1 rounded border border-slate-100 text-center">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase">Quality</span>
                      <span className={`text-sm font-black ${item.quality_score >= 70 ? 'text-emerald-600' : 'text-amber-500'}`}>{item.quality_score}</span>
                    </div>
                    <div className="bg-slate-50 px-2 py-1 rounded border border-slate-100 text-center">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase">Dup Risk</span>
                      <span className={`text-sm font-black ${(item.duplicate_score || 0) > 0.8 ? 'text-rose-500' : 'text-slate-600'}`}>{((item.duplicate_score || 0) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{item.content_type}</span>
                    <span className="text-xs font-bold text-slate-500 truncate flex items-center gap-1">
                       {sourceMeta?.is_official ? <ShieldCheck size={12} className="text-emerald-500"/> : null}
                       {sourceMeta?.source_name || 'Unknown Source'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 truncate mb-1" title={payload.title}>{payload.title || 'Untitled Entry'}</h3>
                  <div className="text-sm text-slate-600 truncate mb-2">{payload.organization || 'No Organization'}</div>
                  
                  <div className="flex flex-wrap gap-3 items-center text-[10px] font-bold text-slate-400 uppercase">
                     {payload.applicationEnd && <span>Deadline: {payload.applicationEnd}</span>}
                     {item.duplicate_of && <span className="text-rose-500 flex items-center gap-1"><ShieldAlert size={12}/> Duplicate Detected</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full md:w-auto shrink-0 flex flex-row md:flex-col gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 justify-end">
                  <Link href={`/admin/studio/ingestion/queue/${item.id}`} className="text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg flex justify-center items-center gap-1 transition flex-1 md:flex-none">
                    <FileSearch size={14}/> Inspect Details
                  </Link>
                  
                  {(currentStatus === 'PENDING' || ['NEW', 'CHANGE_DETECTED', 'DUPLICATE_RISK'].includes(item.status)) && (
                    <div className="flex gap-2 flex-1 md:flex-none">
                      <form action={handleReject} className="flex-1 md:flex-none">
                        <button type="submit" className="w-full text-xs font-bold bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg flex justify-center items-center gap-1 transition">
                          <XCircle size={14}/> Reject
                        </button>
                      </form>
                      <form action={handleApprove} className="flex-1 md:flex-none">
                        <button type="submit" className="w-full text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 px-3 py-2 rounded-lg flex justify-center items-center gap-1 shadow-sm transition">
                          <CheckCircle size={14}/> {item.duplicate_of ? 'Merge' : 'Approve'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

              </div>
            )
          })
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {page > 1 && (
            <Link href={`?page=${page - 1}&status=${currentStatus}&type=${currentType}&search=${searchQuery}`} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
              Previous
            </Link>
          )}
          <span className="text-sm font-medium text-slate-500">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`?page=${page + 1}&status=${currentStatus}&type=${currentType}&search=${searchQuery}`} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
