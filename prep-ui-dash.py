code = """
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Activity, RefreshCw, Database, AlertCircle } from "lucide-react";

export const revalidate = 0;

export default async function IngestionDashboard() {
  const { data: sources, error } = await supabase
    .from('ingestion_sources')
    .select('*')
    .order('priority', { ascending: true });

  const { count: queueCount } = await supabase
    .from('ingestion_queue')
    .select('*', { count: 'exact', head: true })
    .in('status', ['NEW', 'UPDATED', 'DUPLICATE_RISK', 'LOW_QUALITY']);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Ingestion Engine</h1>
          <p className="text-slate-500 mt-1">Manage automated extraction sources and adapters.</p>
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
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Adapter</th>
              <th className="px-6 py-4">Types</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sources?.map(source => (
              <tr key={source.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{source.source_name}</div>
                  <div className="text-xs text-slate-400 truncate max-w-[200px]">{source.base_url}</div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{source.adapter_name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {source.content_types?.map((type: string) => (
                      <span key={type} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{type}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {source.is_active ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Active</span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-slate-400 font-bold text-xs"><div className="w-2 h-2 rounded-full bg-slate-300"/> Disabled</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded transition inline-flex items-center gap-1.5">
                    <RefreshCw size={12} /> Sync Now
                  </button>
                </td>
              </tr>
            ))}
            {!sources || sources.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <AlertCircle size={24} className="mx-auto mb-2 text-slate-400" />
                  No sources configured. Add a source directly via Supabase for now.
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
