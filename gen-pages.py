code_page = """
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Activity, RefreshCw, Database, AlertCircle, CheckCircle, XCircle, TrendingDown, Clock, Search } from "lucide-react";

export const revalidate = 0;

export default async function FeedMonitoringDashboard() {
  const { data: sources, error } = await supabase
    .from('ingestion_sources')
    .select('*')
    .order('tier', { ascending: true });

  const { data: dailyStats } = await supabase
    .from('ingestion_daily_summaries')
    .select('*')
    .order('run_date', { ascending: false })
    .limit(7);

  const { count: queueCount } = await supabase
    .from('ingestion_queue')
    .select('*', { count: 'exact', head: true })
    .in('status', ['NEW', 'VERIFICATION_PENDING', 'DUPLICATE_RISK', 'LOW_QUALITY', 'CHANGE_DETECTED', 'POSSIBLE_MATCH']);

  const todayStat = dailyStats?.[0] || null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Feed Reliability Monitor</h1>
          <p className="text-slate-500 mt-1">Real-time source health, extraction anomalies, and historical daily runs.</p>
        </div>
        <Link href="/admin/studio/ingestion/queue" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition flex items-center gap-2 shadow-sm shadow-indigo-600/20">
          <Database size={18} /> Admin Queue
          {queueCount ? <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-full text-xs ml-2">{queueCount}</span> : null}
        </Link>
      </div>

      {/* DAILY SNAPSHOT */}
      <div>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Today's Snapshot {todayStat ? `(${todayStat.run_date})` : ''}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <div className="text-slate-500 text-xs font-bold mb-1">Sources Checked</div>
            <div className="text-2xl font-black">{todayStat?.sources_checked || 0}</div>
            <div className="text-[10px] text-emerald-600 mt-1 font-bold">{todayStat?.sources_successful || 0} OK, {todayStat?.sources_failed || 0} FAILED</div>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <div className="text-slate-500 text-xs font-bold mb-1">Items Extracted</div>
            <div className="text-2xl font-black text-indigo-700">{todayStat?.total_extracted || 0}</div>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <div className="text-slate-500 text-xs font-bold mb-1">New Items</div>
            <div className="text-2xl font-black text-emerald-700">{todayStat?.total_new || 0}</div>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <div className="text-slate-500 text-xs font-bold mb-1">Duplicates Skipped</div>
            <div className="text-2xl font-black text-slate-700">{todayStat?.total_duplicates || 0}</div>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <div className="text-slate-500 text-xs font-bold mb-1">Changes Detected</div>
            <div className="text-2xl font-black text-blue-700">{todayStat?.total_changed || 0}</div>
          </div>
          <div className="bg-white p-4 border border-red-200 rounded-xl shadow-sm bg-red-50">
            <div className="text-red-700 text-xs font-bold mb-1">Missing Links</div>
            <div className="text-2xl font-black text-red-700">{todayStat?.total_missing_links || 0}</div>
          </div>
        </div>
      </div>

      {/* SOURCE REGISTRY */}
      <div>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Source Health Matrix</h2>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase font-black text-slate-500 tracking-wider">
              <tr>
                <th className="px-5 py-3">Source Registry</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Authority</th>
                <th className="px-5 py-3">Current Health</th>
                <th className="px-5 py-3">Last Checked</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sources?.map(source => {
                let healthColor = 'bg-slate-100 text-slate-600';
                if (source.current_health === 'HEALTHY') healthColor = 'bg-emerald-100 text-emerald-700';
                if (source.current_health === 'WARNING') healthColor = 'bg-amber-100 text-amber-700';
                if (source.current_health === 'FAILING') healthColor = 'bg-red-100 text-red-700';
                if (source.current_health === 'OFFLINE') healthColor = 'bg-slate-800 text-white';

                return (
                  <tr key={source.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3">
                      <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                        {source.source_name} 
                        {!source.is_active && <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase">Disabled</span>}
                      </div>
                      <a href={source.base_url} target="_blank" className="text-[11px] text-indigo-500 hover:underline truncate max-w-[200px]">{source.base_url}</a>
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] font-bold text-slate-500">
                      {source.feed_type || 'MULTIPLE'}
                    </td>
                    <td className="px-5 py-3">
                      {source.is_official ? (
                         <span className="text-emerald-700 text-[11px] font-bold flex items-center w-max gap-1"><CheckCircle size={12}/> Official Tier {source.tier}</span>
                      ) : (
                         <span className="text-amber-700 text-[11px] font-bold flex items-center w-max gap-1"><Search size={12}/> Discovery Tier {source.tier}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest ${healthColor}`}>
                        {source.current_health}
                      </span>
                      {source.consecutive_failures > 0 && <div className="text-[10px] text-red-500 font-bold mt-1">{source.consecutive_failures} failures</div>}
                    </td>
                    <td className="px-5 py-3">
                      {source.last_successful_run ? (
                        <div className="text-[11px] text-slate-600 flex items-center gap-1">
                          <Clock size={12}/> {new Date(source.last_successful_run).toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Never</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/studio/ingestion/sources/${source.id}`} className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded transition inline-flex items-center gap-1.5 shadow-sm">
                        <Activity size={12} /> Inspect
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"""
import os
os.makedirs("src/app/admin/studio/ingestion/sources", exist_ok=True)
with open("src/app/admin/studio/ingestion/page.tsx", "w", encoding="utf-8") as f:
    f.write(code_page)

code_detail = """
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
"""
os.makedirs("src/app/admin/studio/ingestion/sources/[id]", exist_ok=True)
with open("src/app/admin/studio/ingestion/sources/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(code_detail)

code_btn = """
'use client';
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { retrySourceAction } from "../../actions";

export default function RetryButton({ sourceId, adapterName }: { sourceId: string, adapterName: string }) {
  const [loading, setLoading] = useState(false);

  async function handleRetry() {
    setLoading(true);
    await retrySourceAction(sourceId, adapterName);
    setLoading(false);
    window.location.reload();
  }

  return (
    <button 
      onClick={handleRetry} 
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 shadow-sm"
    >
      <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 
      {loading ? 'Retrying...' : 'Force Retry Now'}
    </button>
  );
}
"""
with open("src/app/admin/studio/ingestion/sources/[id]/RetryButton.tsx", "w", encoding="utf-8") as f:
    f.write(code_btn)
