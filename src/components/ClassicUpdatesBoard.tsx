import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

export default async function ClassicUpdatesBoard() {
  // Fetch up to 15 Jobs for the "Job Updates" column
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, scraped_at, job_type, category')
    .eq('status', 'PUBLISHED')
    .neq('category', 'BANNED_KEYWORD')
    .order('scraped_at', { ascending: false })
    .limit(10);

  // Fetch Results, Admissions, Scholarships, and Tenders for the "Latest Updates" column
  const [
    { data: results },
    { data: admissions },
    { data: scholarships },
    { data: tenders }
  ] = await Promise.all([
    supabase.from('results').select('id, title, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(10),
    supabase.from('jobs').select('id, title, scraped_at').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION').order('scraped_at', { ascending: false }).limit(10),
    supabase.from('scholarships').select('id, title, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(5),
    supabase.from('tenders').select('id, title, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(5)
  ]);

  // Mix them all for "Latest Updates"
  const latestUpdates = [
    ...(jobs?.slice(0, 5).map(j => ({ id: j.id, title: j.title, date: j.scraped_at, url: `/jobs/${j.id}` })) || []),
    ...(results?.map(r => ({ id: r.id, title: r.title, date: r.created_at, url: `/results/${r.id}` })) || []),
    ...(admissions?.map(a => ({ id: a.id, title: a.title, date: a.scraped_at, url: `/jobs/${a.id}` })) || []),
    ...(scholarships?.map(s => ({ id: s.id, title: s.title, date: s.created_at, url: `/scholarships/${s.id}` })) || []),
    ...(tenders?.map(t => ({ id: t.id, title: t.title, date: t.created_at, url: `/tenders/${t.id}` })) || [])
  ]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 10);

  const uniqueUpdates = [];
  const seenIds = new Set();
  for (const item of latestUpdates) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueUpdates.push(item);
    }
  }

  const jobUpdates = jobs || [];

  return (
    <div className="max-w-5xl mx-auto w-full box-border bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
        
        {/* Column 1: Latest Updates */}
        <div className="flex flex-col min-w-0 w-full h-full bg-slate-50/30 dark:bg-slate-900/50">
          <div className="bg-slate-900 dark:bg-black text-white text-center py-2 font-bold text-lg border-b-4 border-purple-500">
            Latest Updates
          </div>
          <ul className="flex flex-col w-full min-w-0 flex-1">
            {uniqueUpdates.map((item, index) => (
              <li key={`latest-${item.id}`} className="min-w-0 w-full overflow-hidden odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/40">
                <Link href={item.url} style={{ overflowWrap: "anywhere" }} className="flex items-start sm:items-center py-1.5 px-3 md:px-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-[13px] md:text-sm leading-tight md:leading-normal text-slate-800 whitespace-normal dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-400 font-medium transition-colors group">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="group-hover:underline underline-offset-2">{item.title}</span>
                  </div>
                  {index < 5 && (
                    <span className="shrink-0 mt-0.5 sm:mt-0 inline-block px-1.5 py-[1px] text-[10px] font-black bg-red-500 text-white rounded animate-pulse tracking-wide uppercase shadow-sm">NEW</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/updates" className="block text-center py-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-400 font-bold text-sm transition-colors mt-auto border-t border-slate-200 dark:border-slate-700">
            View All Updates &rarr;
          </Link>
        </div>

        {/* Column 2: Job Updates */}
        <div className="flex flex-col min-w-0 w-full h-full bg-slate-50/30 dark:bg-slate-900/50">
          <div className="bg-slate-900 dark:bg-black text-white text-center py-2 font-bold text-lg border-b-4 border-emerald-500">
            Job Updates
          </div>
          <ul className="flex flex-col w-full min-w-0 flex-1">
            {jobUpdates.map((item, index) => (
              <li key={`job-${item.id}`} className="min-w-0 w-full overflow-hidden odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/40">
                <Link href={`/jobs/${item.id}`} style={{ overflowWrap: "anywhere" }} className="flex items-start sm:items-center py-1.5 px-3 md:px-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-[13px] md:text-sm leading-tight md:leading-normal text-slate-800 whitespace-normal dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors group">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="group-hover:underline underline-offset-2">{item.title}</span>
                  </div>
                  {index < 5 && (
                    <span className="shrink-0 mt-0.5 sm:mt-0 inline-block px-1.5 py-[1px] text-[10px] font-black bg-red-500 text-white rounded animate-pulse tracking-wide uppercase shadow-sm">NEW</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/jobs" className="block text-center py-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-bold text-sm transition-colors mt-auto border-t border-slate-200 dark:border-slate-700">
            View All Jobs &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
