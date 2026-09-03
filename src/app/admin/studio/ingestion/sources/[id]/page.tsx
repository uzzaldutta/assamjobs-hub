
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertTriangle, ShieldCheck, Link2Off, FileX } from "lucide-react";
import RetryButton from "./RetryButton";

export default async function SourceDetail({ params }: { params: { id: string } }) {
  const { data: source } = await supabase.from('ingestion_sources').select('*').eq('id', params.id).single();
  
  if (!source) return <div>Source not found</div>;

  const { data: runs } = await supabase
    .from('ingestion_runs')
    .select('*')
    .eq('source_id', params.id)
    .order('started_at', { ascending: false })
    .limit(50);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 px-4">
      <Link href="/admin/studio/ingestion" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 font-medium">
        <ArrowLeft size={16} /> Back to Monitoring
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{source.source_name}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 font-medium">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{source.current_health}</span>
            <span>{source.is_official ? 'Official Tier 1' : 'Discovery Tier 2'}</span>
            <span>{source.feed_type || 'MULTIPLE FEEDS'}</span>
          </div>
        </div>
        <RetryButton sourceId={source.id} adapterName={source.adapter_name} />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
           <h3 className="font-bold text-slate-800 text-sm">Historical Run Audits (Last 50)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase font-black text-slate-500 tracking-wider">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Extracted</th>
                <th className="px-5 py-3 text-center">New</th>
                <th className="px-5 py-3 text-center">Dupes</th>
                <th className="px-5 py-3 text-center">Changes</th>
                <th className="px-5 py-3 text-center text-red-500"><Link2Off size={14} className="inline"/> Links</th>
                <th className="px-5 py-3 text-center text-orange-500"><FileX size={14} className="inline"/> Low Q</th>
                <th className="px-5 py-3">Error Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {runs?.map(run => (
                <tr key={run.id} className="hover:bg-slate-50 transition text-xs">
                  <td className="px-5 py-3 font-mono text-slate-500">{new Date(run.started_at).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${run.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {run.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center font-bold text-slate-800">{run.items_extracted}</td>
                  <td className="px-5 py-3 text-center font-bold text-emerald-600">{run.items_new}</td>
                  <td className="px-5 py-3 text-center font-bold text-slate-400">{run.items_duplicate}</td>
                  <td className="px-5 py-3 text-center font-bold text-blue-600">{run.items_changed}</td>
                  <td className="px-5 py-3 text-center font-bold text-red-600">{run.items_missing_link}</td>
                  <td className="px-5 py-3 text-center font-bold text-orange-600">{run.items_low_quality}</td>
                  <td className="px-5 py-3 max-w-[200px] truncate text-red-500 font-mono" title={run.run_log}>
                    {run.run_log || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
