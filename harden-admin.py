code = """
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Activity, RefreshCw, Database, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export const revalidate = 0;

export default async function IngestionDashboard() {
  const { data: sources, error } = await supabase
    .from('ingestion_sources')
    .select('*, ingestion_runs(status, finished_at, items_discovered, errors_encountered)')
    .order('priority', { ascending: true });

  const { count: queueCount } = await supabase
    .from('ingestion_queue')
    .select('*', { count: 'exact', head: true })
    .in('status', ['NEW', 'UPDATED', 'DUPLICATE_RISK', 'LOW_QUALITY', 'CHANGE_DETECTED', 'POSSIBLE_MATCH']);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Ingestion Source Registry</h1>
          <p className="text-slate-500 mt-1">Monitor source health, failure rates, and extraction status.</p>
        </div>
        <Link href="/admin/studio/ingestion/queue" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition flex items-center gap-2 shadow-sm shadow-indigo-600/20">
          <Database size={18} /> Review Queue
          {queueCount ? <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-full text-xs ml-2">{queueCount}</span> : null}
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-black text-slate-500">
            <tr>
              <th className="px-6 py-4">Source Registry</th>
              <th className="px-6 py-4">Authority</th>
              <th className="px-6 py-4">Target Feed</th>
              <th className="px-6 py-4">Health / Last Run</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sources?.map(source => {
              const runs = source.ingestion_runs || [];
              const lastRun = runs.length > 0 ? runs.sort((a: any, b: any) => new Date(b.finished_at).getTime() - new Date(a.finished_at).getTime())[0] : null;
              
              return (
                <tr key={source.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      {source.source_name} 
                      {!source.is_active && <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase">Disabled</span>}
                    </div>
                    <a href={source.base_url} target="_blank" className="text-xs text-indigo-500 hover:underline truncate max-w-[200px]">{source.base_url}</a>
                  </td>
                  <td className="px-6 py-4">
                    {source.is_official ? (
                       <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs font-bold flex items-center w-max gap-1"><CheckCircle size={12}/> Official Tier {source.tier}</span>
                    ) : (
                       <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs font-bold flex items-center w-max gap-1"><AlertCircle size={12}/> Discovery Tier {source.tier}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                    {source.feed_type || 'MULTIPLE'}
                  </td>
                  <td className="px-6 py-4">
                    {lastRun ? (
                      <div>
                         <div className={`text-xs font-bold flex items-center gap-1 ${lastRun.status === 'SUCCESS' ? 'text-emerald-600' : 'text-red-600'}`}>
                           {lastRun.status === 'SUCCESS' ? <CheckCircle size={12}/> : <XCircle size={12}/>} 
                           {lastRun.status}
                         </div>
                         <div className="text-[10px] text-slate-400 mt-0.5">
                           {new Date(lastRun.finished_at).toLocaleString()}
                         </div>
                         {lastRun.errors_encountered > 0 && <div className="text-[10px] text-red-500 font-bold mt-0.5">{lastRun.errors_encountered} Errors</div>}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Never run</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded transition inline-flex items-center gap-1.5 shadow-sm">
                      <RefreshCw size={12} /> Fetch Now
                    </button>
                  </td>
                </tr>
              )
            })}
            {!sources || sources.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <AlertCircle size={24} className="mx-auto mb-2 text-slate-400" />
                  No sources configured in registry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"""
with open("src/app/admin/studio/ingestion/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
