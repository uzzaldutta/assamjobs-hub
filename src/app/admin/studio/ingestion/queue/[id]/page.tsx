
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, CheckCircle, XCircle, AlertTriangle, ShieldCheck, 
  ShieldAlert, ExternalLink, Activity, Database, FileCode, Clock
} from "lucide-react";
import { approveQueueItemAction, rejectQueueItemAction } from "../../actions";
import { supabase } from "@/lib/supabase"; // Use service role for admin!

export default async function FeedEntryDetail({ params }: { params: { id: string } }) {
  // Using service role supabase client since this is an admin server component
  
  const { data: item, error: itemError } = await supabase
    .from('ingestion_queue')
    .select('*')
    .eq('id', params.id)
    .single();

  if (itemError || !item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle size={48} className="text-rose-500 mb-4" />
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Entry Not Found</h1>
        <p className="text-slate-500 mb-6">The ingestion queue entry you are looking for does not exist or has been removed.</p>
        <Link href="/admin/studio/ingestion/queue" className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          Back to Queue
        </Link>
      </div>
    );
  }

  const { data: sourceMeta } = await supabase
    .from('ingestion_sources')
    .select('*')
    .eq('id', item.source_id)
    .single();

  const payload = item.payload || {};
  let canonicalId = item.duplicate_of;
  
  if (!canonicalId && item.status === 'APPROVED' && item.content_hash) {
    const { data: prov } = await supabase
      .from('job_provenance')
      .select('canonical_id')
      .eq('content_hash', item.content_hash)
      .limit(1)
      .single();
    if (prov) canonicalId = prov.canonical_id;
  }

  let canonicalRecord = null;
  let targetTable = 'jobs';
  let publicRoute = '#';

  if (canonicalId) {
    if (item.content_type === 'TENDER') { targetTable = 'tenders'; publicRoute = `/tenders/${canonicalId}`; }
    else if (item.content_type === 'ADMISSION') { targetTable = 'admissions'; publicRoute = `/admissions/${canonicalId}`; }
    else if (item.content_type === 'RESULT') { targetTable = 'results'; publicRoute = `/results/${canonicalId}`; }
    else if (item.content_type === 'ADMIT_CARD') { targetTable = 'admit_cards'; publicRoute = `/admit-cards/${canonicalId}`; }
    else if (item.content_type === 'SCHOLARSHIP') { targetTable = 'scholarships'; publicRoute = `/scholarships/${canonicalId}`; }
    else { targetTable = 'jobs'; publicRoute = `/jobs/${canonicalId}`; }

    const { data: canonical } = await supabase.from(targetTable).select('*').eq('id', canonicalId).single();
    canonicalRecord = canonical;
  }

  const handleApprove = async (formData: FormData) => {
    "use server";
    await approveQueueItemAction(item.id, item.payload, item.duplicate_of ? 'UPDATE' : 'NEW');
  };
  const handleReject = async (formData: FormData) => {
    "use server";
    await rejectQueueItemAction(item.id);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-6">
        <Link href="/admin/studio/ingestion/queue" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition">
          <ArrowLeft size={16} /> Back to Ingestion Queue
        </Link>
      </div>

      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg ${
                item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                item.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                item.status === 'CHANGE_DETECTED' ? 'bg-amber-100 text-amber-700' :
                item.status === 'DUPLICATE_RISK' ? 'bg-orange-100 text-orange-700' :
                item.status === 'LOW_QUALITY' ? 'bg-slate-200 text-slate-700' :
                'bg-indigo-100 text-indigo-700'
              }`}>
                {item.status.replace('_', ' ')}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                {item.content_type}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Feed Entry Details</h1>
            <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
              <Database size={14}/> ID: {item.id}
            </p>
          </div>
          <div className="flex gap-2">
            {item.status !== 'APPROVED' && item.status !== 'REJECTED' && (
              <>
                <form action={handleReject}>
                  <button type="submit" className="text-sm font-bold bg-white border-2 border-rose-200 text-rose-600 hover:bg-rose-50 px-6 py-2.5 rounded-xl flex items-center gap-2 transition">
                    <XCircle size={16}/> Reject Entry
                  </button>
                </form>
                <form action={handleApprove}>
                  <button type="submit" className="text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition">
                    <CheckCircle size={16}/> {item.status === 'CHANGE_DETECTED' ? 'Approve Update' : item.duplicate_of ? 'Merge Duplicate' : 'Approve & Publish'}
                  </button>
                </form>
              </>
            )}
            {item.status === 'REJECTED' && (
              <form action={handleApprove}>
                <button type="submit" className="text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition">
                  <CheckCircle size={16}/> Re-Approve & Publish
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* SOURCE INFORMATION */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <ExternalLink size={16} className="text-indigo-500" /> Source Information
          </h2>
          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Source Name</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{sourceMeta?.source_name || payload.source || 'Unknown'}</span>
            </div>
            {sourceMeta && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tier</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Tier {sourceMeta.tier}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Verification</span>
                  {sourceMeta.is_official ? (
                     <span className="text-emerald-600 flex items-center gap-1 text-sm font-bold"><ShieldCheck size={14}/> Official</span>
                  ) : (
                     <span className="text-amber-600 flex items-center gap-1 text-sm font-bold"><AlertTriangle size={14}/> Unofficial</span>
                  )}
                </div>
              </div>
            )}
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Source URL</span>
              {payload.sourceUrl ? (
                <a href={payload.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-indigo-600 hover:underline break-all">
                  {payload.sourceUrl}
                </a>
              ) : (
                <span className="text-sm font-bold text-slate-400">Not provided</span>
              )}
            </div>
          </div>
        </div>

        {/* INGESTION METRICS */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <Activity size={16} className="text-emerald-500" /> Quality & Ingestion
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Quality Score</span>
              <span className={`text-2xl font-black ${item.quality_score >= 70 ? 'text-emerald-600' : item.quality_score >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                {item.quality_score} <span className="text-sm text-slate-400">/ 100</span>
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duplicate Risk</span>
              <span className={`text-2xl font-black ${item.duplicate_score > 0.8 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                {(item.duplicate_score * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-slate-400"/>
              <span className="font-medium text-slate-500">Created:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{new Date(item.created_at).toLocaleString()}</span>
            </div>
            {item.approved_at && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={14} className="text-emerald-500"/>
                <span className="font-medium text-slate-500">Approved:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{new Date(item.approved_at).toLocaleString()}</span>
              </div>
            )}
            {item.rejected_at && (
              <div className="flex items-center gap-2 text-sm">
                <XCircle size={14} className="text-rose-500"/>
                <span className="font-medium text-slate-500">Rejected:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{new Date(item.rejected_at).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMPARISON VIEW */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <FileCode size={16} className="text-blue-500" /> Source vs Canonical Data
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          
          {/* RAW SOURCE PAYLOAD */}
          <div className="p-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Raw Ingested Payload</h3>
            <div className="space-y-4 mb-6">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Title</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{payload.title || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Organization</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{payload.organization || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Apply URL</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 break-all">{payload.applyUrl || payload.sourceUrl || 'N/A'}</span>
              </div>
            </div>
            
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Complete Raw JSON</h3>
            <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto max-w-full">
              <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap word-break">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* CANONICAL RECORD */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Canonical Published Record</h3>
              {canonicalRecord && (
                <Link href={publicRoute} target="_blank" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg flex items-center gap-1 transition">
                  View Public <ExternalLink size={12}/>
                </Link>
              )}
            </div>
            
            {canonicalRecord ? (
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Table</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{targetTable}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Final Title</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{canonicalRecord.title || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Organization / Institution</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{canonicalRecord.organization || canonicalRecord.institution || canonicalRecord.department || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Final URL</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 break-all">{canonicalRecord.apply_url || canonicalRecord.application_link || canonicalRecord.download_url || canonicalRecord.official_source_url || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Publication Status</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{canonicalRecord.status}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <Database size={32} className="text-slate-300 mb-3"/>
                <p className="text-sm font-bold text-slate-500">No Canonical Record</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">This entry has not yet been merged or published.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
