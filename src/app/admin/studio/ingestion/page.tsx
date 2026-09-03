
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Activity, RefreshCw, Database, AlertCircle, CheckCircle, XCircle, Clock, Search, ShieldAlert, FileSearch, Filter } from "lucide-react";

export const revalidate = 0;

export default async function FeedMonitoringDashboard({ searchParams }: { searchParams: { filter?: string, date?: string } }) {
  const filter = searchParams.filter || 'ALL';
  const targetDate = searchParams.date || new Date().toISOString().split('T')[0];

  const { data: sources } = await supabase.from('ingestion_sources').select('*').order('tier', { ascending: true });
  const { data: dailyStats } = await supabase.from('ingestion_daily_summaries').select('*').order('run_date', { ascending: false }).limit(30);

  const { count: queueCount } = await supabase.from('ingestion_queue').select('*', { count: 'exact', head: true })
    .in('status', ['NEW', 'VERIFICATION_PENDING', 'DUPLICATE_RISK', 'LOW_QUALITY', 'CHANGE_DETECTED', 'POSSIBLE_MATCH']);

  const todayStat = dailyStats?.find(d => d.run_date === targetDate) || dailyStats?.[0] || null;

  // Enhance sources with STALE status if last_successful_run > 48h ago
  const STALE_THRESHOLD = 48 * 60 * 60 * 1000;
  const now = Date.now();
  
  const enhancedSources = (sources || []).map(s => {
      let isStale = false;
      if (s.is_active && s.current_health === 'HEALTHY' && s.last_successful_run) {
          const diff = now - new Date(s.last_successful_run).getTime();
          if (diff > STALE_THRESHOLD) isStale = true;
      }
      return { ...s, computed_health: isStale ? 'STALE' : s.current_health };
  });

  const alerts = enhancedSources.filter(s => s.computed_health === 'FAILING' || s.computed_health === 'WARNING' || s.computed_health === 'STALE' || s.computed_health === 'OFFLINE');

  // Filter sources for table
  const filteredSources = enhancedSources.filter(s => {
      if (filter === 'ALL') return true;
      return s.computed_health === filter;
  });

  // Calculate Coverage
  const coverage = ['JOB', 'TENDER', 'ADMISSION', 'RESULT', 'ADMIT_CARD', 'SCHOLARSHIP'].map(feedType => {
      const feedSources = enhancedSources.filter(s => s.feed_type === feedType || s.feed_type === 'MULTIPLE');
      const activeSources = feedSources.filter(s => s.is_active);
      return { feedType, total: feedSources.length, active: activeSources.length };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Feed Operations Control Center</h1>
          <p className="text-slate-500 mt-1">Run, monitor, verify, and maintain the ingestion ecosystem.</p>
        </div>
        <Link href="/admin/studio/ingestion/queue" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition flex items-center gap-2 shadow-sm">
          <Database size={18} /> Review Queue
          {queueCount ? <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-full text-xs ml-2">{queueCount}</span> : null}
        </Link>
      </div>

      {/* OPERATIONAL ALERTS */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
           <h2 className="text-sm font-black text-red-800 uppercase tracking-wider mb-3 flex items-center gap-2"><ShieldAlert size={16}/> Operational Alerts</h2>
           <div className="space-y-2">
             {alerts.map(a => (
               <div key={a.id} className="text-sm text-red-700 flex items-center justify-between">
                 <div><strong className="mr-2">{a.source_name}:</strong> {a.computed_health} - {a.computed_health === 'STALE' ? 'No recent successful extraction' : (a.last_error || 'Unknown failure')}</div>
                 <Link href={`/admin/studio/ingestion/sources/${a.id}`} className="text-xs font-bold underline">Investigate</Link>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* DAILY OVERVIEW */}
      <div>
        <div className="flex items-center justify-between mb-3">
           <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">Daily Run Overview</h2>
           <form className="flex items-center gap-2">
              <input type="hidden" name="filter" value={filter} />
              <select name="date" className="text-xs border-slate-200 rounded p-1 text-slate-600" defaultValue={targetDate} onChange={(e) => e.target.form?.submit()}>
                 {dailyStats?.map(d => (
                    <option key={d.run_date} value={d.run_date}>{d.run_date}</option>
                 ))}
                 {!dailyStats?.length && <option value={targetDate}>{targetDate}</option>}
              </select>
              <button type="submit" className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-slate-600">Load</button>
           </form>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
             <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Sources</div>
             <div className="text-xl font-black">{todayStat?.sources_checked || 0}</div>
             <div className="text-[10px] text-emerald-600 font-bold mt-1">{todayStat?.sources_successful || 0} OK, {todayStat?.sources_failed || 0} FAIL</div>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
             <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Extracted</div>
             <div className="text-xl font-black text-indigo-700">{todayStat?.total_extracted || 0}</div>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
             <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">New</div>
             <div className="text-xl font-black text-emerald-700">{todayStat?.total_new || 0}</div>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
             <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Duplicates</div>
             <div className="text-xl font-black text-slate-700">{todayStat?.total_duplicates || 0}</div>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
             <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Changes</div>
             <div className="text-xl font-black text-blue-700">{todayStat?.total_changed || 0}</div>
          </div>
          <div className="bg-white p-4 border border-red-200 rounded-xl shadow-sm bg-red-50">
             <div className="text-red-700 text-[10px] font-bold uppercase mb-1">Missing Links</div>
             <div className="text-xl font-black text-red-700">{todayStat?.total_missing_links || 0}</div>
          </div>
        </div>
      </div>

      {/* FEED COVERAGE DASHBOARD */}
      <div>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Feed Coverage Pipeline</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
           {coverage.map(c => (
              <div key={c.feedType} className="bg-slate-50 p-3 border border-slate-200 rounded-xl">
                 <div className="text-xs font-black text-slate-800">{c.feedType}</div>
                 <div className="text-[10px] text-slate-500 mt-1">{c.active} active / {c.total} total sources</div>
              </div>
           ))}
        </div>
      </div>

      {/* SOURCE HEALTH MATRIX */}
      <div>
        <div className="flex items-center justify-between mb-3">
           <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">Source Health Matrix</h2>
           <form className="flex items-center gap-2">
              <input type="hidden" name="date" value={targetDate} />
              <select name="filter" className="text-xs border-slate-200 rounded p-1 text-slate-600" defaultValue={filter} onChange={(e) => e.target.form?.submit()}>
                 <option value="ALL">All Status</option>
                 <option value="HEALTHY">Healthy</option>
                 <option value="WARNING">Warning</option>
                 <option value="FAILING">Failing</option>
                 <option value="STALE">Stale</option>
                 <option value="OFFLINE">Offline</option>
              </select>
              <button type="submit" className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-slate-600">Filter</button>
           </form>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-500 tracking-wider">
              <tr>
                <th className="px-5 py-3">Source Registry</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Authority</th>
                <th className="px-5 py-3">Health</th>
                <th className="px-5 py-3">Last Checked</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSources?.map(source => {
                let healthColor = 'bg-slate-100 text-slate-600';
                if (source.computed_health === 'HEALTHY') healthColor = 'bg-emerald-100 text-emerald-700';
                if (source.computed_health === 'WARNING') healthColor = 'bg-amber-100 text-amber-700';
                if (source.computed_health === 'FAILING') healthColor = 'bg-red-100 text-red-700';
                if (source.computed_health === 'STALE') healthColor = 'bg-purple-100 text-purple-700';
                if (source.computed_health === 'OFFLINE') healthColor = 'bg-slate-800 text-white';

                return (
                  <tr key={source.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3">
                      <div className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                        {source.source_name} 
                        {!source.is_active && <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase">Disabled</span>}
                      </div>
                      <a href={source.base_url} target="_blank" className="text-[10px] text-indigo-500 hover:underline truncate max-w-[200px]">{source.base_url}</a>
                    </td>
                    <td className="px-5 py-3 font-mono text-[10px] font-bold text-slate-500">
                      {source.feed_type || 'MULTIPLE'}
                    </td>
                    <td className="px-5 py-3">
                      {source.is_official ? (
                         <span className="text-emerald-700 text-[10px] font-bold flex items-center w-max gap-1"><CheckCircle size={10}/> Official T{source.tier}</span>
                      ) : (
                         <span className="text-amber-700 text-[10px] font-bold flex items-center w-max gap-1"><Search size={10}/> Discovery T{source.tier}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded text-[9px] font-black tracking-widest ${healthColor}`}>
                        {source.computed_health}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {source.last_successful_run ? (
                        <div className="text-[10px] text-slate-600 flex items-center gap-1">
                          <Clock size={10}/> {new Date(source.last_successful_run).toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Never</span>
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
          {filteredSources.length === 0 && (
             <div className="p-8 text-center text-slate-500 text-sm">No sources match this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
}
