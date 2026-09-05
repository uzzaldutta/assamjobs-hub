
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Activity, Search, AlertTriangle, ShieldCheck, Database, Calendar } from "lucide-react";

export const revalidate = 0;

export default async function DailyFeedReport({ searchParams }: { searchParams: { timeframe?: string } }) {
  const timeframe = searchParams.timeframe || "today";

  // Calculate Date bounds
  const now = new Date();
  let startDate = new Date();
  if (timeframe === 'today') {
    startDate.setHours(0,0,0,0);
  } else if (timeframe === 'yesterday') {
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0,0,0,0);
    const endOfYesterday = new Date(startDate);
    endOfYesterday.setHours(23,59,59,999);
    now.setTime(endOfYesterday.getTime());
  } else if (timeframe === '7days') {
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0,0,0,0);
  }
  const isoStart = startDate.toISOString();
  const isoEnd = now.toISOString();

  // 1. Fetch Sources
  const { data: sources } = await supabase.from('ingestion_sources').select('*');
  
  // 2. Fetch Queue Items in timeframe
  const { data: queueItems } = await supabase
    .from('ingestion_queue')
    .select('id, source_url, status, created_at, source_id, processed_at')
    .gte('created_at', isoStart)
    .lte('created_at', isoEnd);

  // 3. Fetch Published Jobs (Canonical) in timeframe
  const { count: publishedCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'PUBLISHED')
    .gte('scraped_at', isoStart)
    .lte('scraped_at', isoEnd);

  // Aggregations
  const totalDiscovered = queueItems?.length || 0;
  
  const statusCounts: Record<string, number> = {};
  queueItems?.forEach(q => {
    statusCounts[q.status] = (statusCounts[q.status] || 0) + 1;
  });

  const pendingCount = (statusCounts['NEW'] || 0) + (statusCounts['VERIFICATION_PENDING'] || 0);
  const duplicateCandidates = (statusCounts['DUPLICATE_RISK'] || 0) + (statusCounts['POSSIBLE_MATCH'] || 0);
  const lowQuality = statusCounts['LOW_QUALITY'] || 0;
  const changes = statusCounts['CHANGE_DETECTED'] || 0;
  const rejectedCount = statusCounts['REJECTED'] || 0;
  const approvedCount = statusCounts['APPROVED'] || 0;

  // Source Health
  const STALE_THRESHOLD = 48 * 60 * 60 * 1000;
  const activeSources = sources?.filter(s => s.is_active) || [];
  
  let successfulSources = 0;
  let failedSources = 0;
  let staleSources = 0;
  let zeroResultSources = 0;

  const sourceMetrics: any[] = activeSources.map(s => {
    const isStale = s.last_successful_run ? (Date.now() - new Date(s.last_successful_run).getTime() > STALE_THRESHOLD) : true;
    const computedHealth = s.current_health === 'FAILING' ? 'FAILING' : isStale ? 'STALE' : 'HEALTHY';
    
    if (computedHealth === 'HEALTHY') successfulSources++;
    if (computedHealth === 'FAILING') failedSources++;
    if (computedHealth === 'STALE') staleSources++;

    const itemsForSource = queueItems?.filter(q => q.source_id === s.id) || [];
    if (itemsForSource.length === 0 && computedHealth === 'HEALTHY') zeroResultSources++;

    let sPending = 0;
    let sDuplicate = 0;
    let sRejected = 0;
    let sApproved = 0;
    let sLowQuality = 0;

    itemsForSource.forEach(q => {
      if (['NEW', 'VERIFICATION_PENDING'].includes(q.status)) sPending++;
      if (['DUPLICATE_RISK', 'POSSIBLE_MATCH'].includes(q.status)) sDuplicate++;
      if (q.status === 'REJECTED') sRejected++;
      if (q.status === 'APPROVED') sApproved++;
      if (q.status === 'LOW_QUALITY') sLowQuality++;
    });

    return {
      ...s,
      computedHealth,
      discovered: itemsForSource.length,
      pending: sPending,
      duplicate: sDuplicate,
      rejected: sRejected,
      approved: sApproved,
      lowQuality: sLowQuality
    };
  });

  const duplicateRate = totalDiscovered > 0 ? ((duplicateCandidates / totalDiscovered) * 100).toFixed(1) : "0";
  const rejectionRate = totalDiscovered > 0 ? ((rejectedCount / totalDiscovered) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6 border-slate-200 dark:border-slate-800">
        <div>
          <Link href="/admin/studio/ingestion" className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft size={16} /> Back to Monitoring
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Daily Feed Report</h1>
          <p className="text-slate-500 mt-1">Read-only operational analytics from production tables.</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
          <Link href="?timeframe=today" className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${timeframe === 'today' ? 'bg-white dark:bg-slate-800 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
            Today
          </Link>
          <Link href="?timeframe=yesterday" className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${timeframe === 'yesterday' ? 'bg-white dark:bg-slate-800 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
            Yesterday
          </Link>
          <Link href="?timeframe=7days" className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${timeframe === '7days' ? 'bg-white dark:bg-slate-800 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
            Last 7 Days
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Source Health */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Activity size={16}/> Source Health</h3>
          <div className="space-y-3 text-sm font-medium">
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Total Active Checked</span> <span className="font-bold">{activeSources.length}</span></div>
            <div className="flex justify-between"><span className="text-emerald-600">Successful</span> <span className="font-bold">{successfulSources}</span></div>
            <Link href="/admin/studio/ingestion/sources?filter=FAILING" className="flex justify-between hover:underline group"><span className="text-red-600 group-hover:text-red-500">Failed</span> <span className="font-bold text-red-600">{failedSources}</span></Link>
            <Link href="/admin/studio/ingestion/sources?filter=STALE" className="flex justify-between hover:underline group"><span className="text-amber-600 group-hover:text-amber-500">Stale</span> <span className="font-bold text-amber-600">{staleSources}</span></Link>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Zero Result Sources</span> <span className="font-bold">{zeroResultSources}</span></div>
          </div>
        </div>

        {/* Ingestion */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Database size={16}/> Ingestion</h3>
          <div className="space-y-3 text-sm font-medium">
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Discovered</span> <span className="font-bold">{totalDiscovered}</span></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">New / Change</span> <span className="font-bold">{statusCounts['NEW'] || 0} / {changes}</span></div>
            <div className="flex justify-between"><span className="text-amber-600">Duplicate Candidates</span> <span className="font-bold">{duplicateCandidates}</span></div>
            <div className="flex justify-between"><span className="text-emerald-600">Approved (Queue)</span> <span className="font-bold">{approvedCount}</span></div>
            <div className="flex justify-between"><span className="text-indigo-600">Published (Public)</span> <span className="font-bold">{publishedCount}</span></div>
          </div>
        </div>

        {/* Quality */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><ShieldCheck size={16}/> Quality</h3>
          <div className="space-y-3 text-sm font-medium">
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Duplicate Rate</span> <span className="font-bold">{duplicateRate}%</span></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Rejection Rate</span> <span className="font-bold">{rejectionRate}%</span></div>
            <div className="flex justify-between"><span className="text-amber-600">Low Quality Count</span> <span className="font-bold">{lowQuality}</span></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Rejected</span> <span className="font-bold">{rejectedCount}</span></div>
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 shadow-sm">
          <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2"><AlertTriangle size={16}/> Action Required</h3>
          <div className="space-y-3 text-sm font-medium">
            <Link href="/admin/studio/ingestion/queue?status=PENDING" className="flex justify-between hover:underline text-slate-800 dark:text-slate-200"><span>Pending Review</span> <span className="font-black text-red-600">{pendingCount}</span></Link>
            <Link href="/admin/studio/ingestion/queue?status=DUPLICATE_RISK" className="flex justify-between hover:underline text-slate-800 dark:text-slate-200"><span>Duplicate Risk</span> <span className="font-black text-amber-600">{duplicateCandidates}</span></Link>
            <Link href="/admin/studio/ingestion/queue?status=LOW_QUALITY" className="flex justify-between hover:underline text-slate-800 dark:text-slate-200"><span>Low Quality</span> <span className="font-black text-amber-600">{lowQuality}</span></Link>
            <Link href="/admin/studio/ingestion/sources?filter=FAILING" className="flex justify-between hover:underline text-slate-800 dark:text-slate-200"><span>Failed Sources</span> <span className="font-black text-red-600">{failedSources}</span></Link>
          </div>
        </div>
      </div>

      {/* Source-by-Source Report */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
           <h3 className="font-black text-lg text-slate-800 dark:text-slate-200">Source-by-Source Report</h3>
           <span className="text-xs font-medium text-slate-500 uppercase">Active Sources Only</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3 font-bold text-slate-600 dark:text-slate-400">Source Name</th>
                <th className="px-4 py-3 font-bold text-slate-600 dark:text-slate-400">Tier</th>
                <th className="px-4 py-3 font-bold text-slate-600 dark:text-slate-400">Health</th>
                <th className="px-4 py-3 font-bold text-slate-600 dark:text-slate-400 text-center">Discovered</th>
                <th className="px-4 py-3 font-bold text-slate-600 dark:text-slate-400 text-center">Pending</th>
                <th className="px-4 py-3 font-bold text-slate-600 dark:text-slate-400 text-center">Duplicate</th>
                <th className="px-4 py-3 font-bold text-slate-600 dark:text-slate-400 text-center">Rejected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sourceMetrics.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {s.source_name}
                    {s.is_official && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Official</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.tier}</td>
                  <td className="px-4 py-3">
                     <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        s.computedHealth === 'HEALTHY' ? 'bg-emerald-100 text-emerald-700' :
                        s.computedHealth === 'STALE' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                     }`}>
                        {s.computedHealth}
                     </span>
                  </td>
                  <td className="px-4 py-3 text-center font-medium">{s.discovered}</td>
                  <td className="px-4 py-3 text-center"><span className={s.pending > 0 ? "text-amber-600 font-bold" : "text-slate-400"}>{s.pending}</span></td>
                  <td className="px-4 py-3 text-center"><span className={s.duplicate > 0 ? "text-orange-500 font-bold" : "text-slate-400"}>{s.duplicate}</span></td>
                  <td className="px-4 py-3 text-center"><span className={s.rejected > 0 ? "text-red-500 font-bold" : "text-slate-400"}>{s.rejected}</span></td>
                </tr>
              ))}
              {sourceMetrics.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 italic">No active sources found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
