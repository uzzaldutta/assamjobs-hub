code = """
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import { CheckCircle, XCircle, ExternalLink, ShieldAlert, FileSearch, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function IngestionQueue() {
  const { data: queueItems } = await supabase
    .from('ingestion_queue')
    .select('*, ingestion_sources(source_name, is_official, tier)')
    .in('status', ['NEW', 'CHANGE_DETECTED', 'DUPLICATE_RISK', 'LOW_QUALITY', 'VERIFICATION_PENDING'])
    .order('created_at', { ascending: false });

  async function approveAction(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    await supabase.from('ingestion_queue').update({ status: 'APPROVED' }).eq('id', id);
    revalidatePath('/admin/studio/ingestion/queue');
  }

  async function rejectAction(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    await supabase.from('ingestion_queue').update({ status: 'REJECTED' }).eq('id', id);
    revalidatePath('/admin/studio/ingestion/queue');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      <PageHeader 
        title="Admin Review Queue" 
        subtitle="Verify extracted canonical records before public deployment"
        theme="blue"
      />
      
      <div className="space-y-6 px-4 sm:px-0">
        {!queueItems || queueItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Queue is Empty</h3>
            <p className="text-slate-500 mt-2">All ingestion items have been reviewed.</p>
          </div>
        ) : (
          queueItems.map(item => {
            const payload = item.normalized_payload || {};
            const sourceMeta = item.ingestion_sources;
            
            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row gap-6">
                
                {/* Left Panel: Metrics & Status */}
                <div className="lg:w-1/4 border-r border-slate-100 pr-6 flex flex-col gap-4">
                  <div>
                     <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded ${
                       item.status === 'CHANGE_DETECTED' ? 'bg-amber-100 text-amber-700' :
                       item.status === 'DUPLICATE_RISK' ? 'bg-rose-100 text-rose-700' :
                       item.status === 'LOW_QUALITY' ? 'bg-slate-200 text-slate-700' :
                       'bg-indigo-100 text-indigo-700'
                     }`}>
                       {item.status.replace('_', ' ')}
                     </span>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Quality Score</span>
                    <div className="flex items-end gap-2">
                      <span className={`text-2xl font-black ${item.quality_score >= 70 ? 'text-emerald-600' : item.quality_score >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {item.quality_score}
                      </span>
                      <span className="text-xs text-slate-400 font-bold mb-1">/ 100</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Duplicate Risk</span>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                       <ShieldAlert size={14} className={item.duplicate_score > 0.8 ? 'text-rose-500' : 'text-slate-400'}/>
                       {(item.duplicate_score * 100).toFixed(0)}% Match
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Verification</span>
                    <div className="flex items-center gap-1.5 text-sm font-bold">
                       {sourceMeta?.is_official ? (
                         <span className="text-emerald-600 flex items-center gap-1"><ShieldCheck size={14}/> Verified</span>
                       ) : (
                         <span className="text-amber-600 flex items-center gap-1"><AlertTriangle size={14}/> Pending</span>
                       )}
                    </div>
                  </div>
                </div>

                {/* Main Panel: Data */}
                <div className="lg:w-3/4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{payload.title}</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                       <div>
                         <span className="block text-[10px] text-slate-400 font-bold uppercase">Organization</span>
                         <span className="text-sm font-bold text-slate-700">{payload.organization || 'N/A'}</span>
                       </div>
                       <div>
                         <span className="block text-[10px] text-slate-400 font-bold uppercase">Vacancy</span>
                         <span className="text-sm font-bold text-slate-700">{payload.vacancy || 'N/A'}</span>
                       </div>
                       <div>
                         <span className="block text-[10px] text-slate-400 font-bold uppercase">Deadline</span>
                         <span className="text-sm font-bold text-slate-700">{payload.applicationEnd || 'N/A'}</span>
                       </div>
                       <div>
                         <span className="block text-[10px] text-slate-400 font-bold uppercase">Official Source</span>
                         <span className="text-sm font-bold text-slate-700 truncate block">{sourceMeta?.is_official ? sourceMeta.source_name : 'No'}</span>
                       </div>
                    </div>

                    {/* Change Diff Viewer */}
                    {item.change_diff && item.change_diff.length > 0 && (
                      <div className="mb-4 bg-amber-50 border border-amber-100 rounded-lg p-4">
                        <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-2"><ArrowRight size={14}/> Changes Detected</h4>
                        {item.change_diff.map((diff: any, i: number) => (
                          <div key={i} className="flex items-center gap-4 text-sm font-medium mb-2 last:mb-0">
                             <span className="w-24 text-slate-500">{diff.field}:</span>
                             <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded line-through">{diff.old_value}</span>
                             <ArrowRight size={14} className="text-slate-400"/>
                             <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">{diff.new_value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Links */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex gap-2">
                       {payload.sourceUrl && (
                         <a href={payload.sourceUrl} target="_blank" className="text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded flex items-center gap-1"><ExternalLink size={12}/> Open Source</a>
                       )}
                       {payload.applyUrl && (
                         <a href={payload.applyUrl} target="_blank" className="text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded flex items-center gap-1"><ExternalLink size={12}/> Apply Link</a>
                       )}
                       {payload.notificationUrl && (
                         <a href={payload.notificationUrl} target="_blank" className="text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded flex items-center gap-1"><ExternalLink size={12}/> Notification PDF</a>
                       )}
                    </div>
                    
                    <div className="flex gap-2">
                      {item.duplicate_of && (
                        <button className="text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded flex items-center gap-1 shadow-sm"><FileSearch size={14}/> View Duplicate</button>
                      )}
                      
                      <form action={rejectAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="text-xs font-bold bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded flex items-center gap-1 transition"><XCircle size={14}/> Reject</button>
                      </form>

                      <form action={approveAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 px-6 py-2 rounded flex items-center gap-1 shadow-sm shadow-emerald-500/20 transition">
                          <CheckCircle size={14}/> {item.status === 'CHANGE_DETECTED' ? 'Approve Update' : item.duplicate_of ? 'Merge' : 'Approve'}
                        </button>
                      </form>
                    </div>
                  </div>

                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}
"""
with open("src/app/admin/studio/ingestion/queue/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
