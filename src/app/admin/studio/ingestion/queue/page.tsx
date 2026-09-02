
import { supabase } from "@/lib/supabase";
import { approveQueueItemAction, rejectQueueItemAction } from "../actions";
import { Check, X, AlertTriangle, FileText, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function ReviewQueuePage() {
  const { data: queueItems, error } = await supabase
    .from('ingestion_queue')
    .select('*, ingestion_sources(source_name)')
    .in('status', ['NEW', 'UPDATED', 'DUPLICATE_RISK', 'LOW_QUALITY'])
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return <div>Error loading review queue: {error.message}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Ingestion Review Workspace</h1>
        <p className="text-slate-500 mt-1">Review, approve, and deduplicate items automatically extracted from sources.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/studio/ingestion" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg transition text-center">
          &larr; Back to Sources
        </Link>
      </div>

      {(!queueItems || queueItems.length === 0) ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
          <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Queue is Empty</h2>
          <p className="text-slate-500 mt-2">All discovered items have been reviewed!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queueItems.map((item: any) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-[10px] font-black uppercase rounded ${
                      item.status === 'DUPLICATE_RISK' ? 'bg-amber-100 text-amber-700' :
                      item.status === 'LOW_QUALITY' ? 'bg-red-100 text-red-700' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{item.ingestion_sources?.source_name}</span>
                    <span className="text-xs font-bold text-slate-500">Score: {item.quality_score}/100</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm font-medium text-slate-600">{item.normalized_payload?.organization}</p>
                </div>
                <div className="flex gap-2">
                  <form action={async () => { "use server"; await rejectQueueItemAction(item.id); }}>
                    <button className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold text-sm transition flex items-center gap-1">
                      <X size={16}/> Reject
                    </button>
                  </form>
                  <form action={async () => { "use server"; await approveQueueItemAction(item.id); }}>
                    <button className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-bold text-sm transition flex items-center gap-1">
                      <Check size={16}/> Approve
                    </button>
                  </form>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="block text-xs font-bold text-slate-400">Type</span>
                  <span className="text-sm font-medium text-slate-700">{item.content_type}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Location</span>
                  <span className="text-sm font-medium text-slate-700">{item.normalized_payload?.location || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Deadline</span>
                  <span className="text-sm font-medium text-slate-700">{item.normalized_payload?.applicationEnd || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Vacancies</span>
                  <span className="text-sm font-medium text-slate-700">{item.normalized_payload?.vacancy || 'N/A'}</span>
                </div>
              </div>


              {item.status === 'CHANGE_DETECTED' && item.change_diff && item.change_diff.length > 0 && (
                <div className="mt-4 border border-amber-200 bg-amber-50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-3"><AlertTriangle size={16}/> Changes Detected vs Canonical Record</h4>
                  <div className="space-y-2">
                    {item.change_diff.map((diff: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-3 gap-2 text-sm bg-white p-2 rounded border border-amber-100">
                        <div className="font-bold text-slate-700 capitalize">{diff.field.replace('_', ' ')}</div>
                        <div className="text-red-600 line-through truncate" title={diff.old_value}>{diff.old_value || 'None'}</div>
                        <div className="text-emerald-600 font-bold truncate" title={diff.new_value}>{diff.new_value || 'None'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm font-medium">
                {item.source_url && (
                  <a href={item.source_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                    <ExternalLink size={14}/> View Official Source
                  </a>
                )}
                {item.duplicate_score > 0 && (
                  <div className="text-amber-600 flex items-center gap-1">
                    <AlertTriangle size={14}/> Dup Score: {item.duplicate_score.toFixed(2)}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
