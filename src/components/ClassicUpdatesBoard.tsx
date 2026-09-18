import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { format } from "date-fns";

export default async function ClassicUpdatesBoard() {
  // Fetch up to 30 Jobs for the "Job Updates" column
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, scraped_at, job_type, category')
    .eq('status', 'PUBLISHED')
    .neq('category', 'BANNED_KEYWORD')
    .order('scraped_at', { ascending: false })
    .limit(30);

  // Fetch Results, Admissions, Scholarships, and Tenders for the "Latest Updates" column
  const [
    { data: results },
    { data: admissions },
    { data: scholarships },
    { data: tenders }
  ] = await Promise.all([
    supabase.from('results').select('id, title, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(20),
    supabase.from('jobs').select('id, title, scraped_at').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION').order('scraped_at', { ascending: false }).limit(20),
    supabase.from('scholarships').select('id, title, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(10),
    supabase.from('tenders').select('id, title, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(10)
  ]);

  // Mix them all for "Latest Updates"
  const latestUpdates = [
    ...(jobs?.slice(0, 10).map(j => ({ id: j.id, title: j.title, date: j.scraped_at, url: `/jobs/${j.id}` })) || []),
    ...(results?.map(r => ({ id: r.id, title: r.title, date: r.created_at, url: `/results/${r.id}` })) || []),
    ...(admissions?.map(a => ({ id: a.id, title: a.title, date: a.scraped_at, url: `/jobs/${a.id}` })) || []),
    ...(scholarships?.map(s => ({ id: s.id, title: s.title, date: s.created_at, url: `/scholarships/${s.id}` })) || []),
    ...(tenders?.map(t => ({ id: t.id, title: t.title, date: t.created_at, url: `/tenders/${t.id}` })) || [])
  ]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 30); // Show top 30 mixed items

  const jobUpdates = jobs || [];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-thin-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-thin-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-thin-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .dark .custom-thin-scroll::-webkit-scrollbar-thumb {
          background-color: #334155;
        }
      `}} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
        
        {/* Column 1: Latest Updates */}
        <div className="flex flex-col">
          <div className="bg-slate-900 dark:bg-black text-white text-center py-3 font-bold text-lg border-b-4 border-purple-500 sticky top-0 z-10">
            Latest Updates
          </div>
          <div className="max-h-[450px] overflow-y-auto custom-thin-scroll bg-slate-50/30 dark:bg-slate-900/50">
            <ul className="flex flex-col px-3">
              {latestUpdates.map(item => (
                <li key={`latest-${item.id}`} className="border-b border-dashed border-slate-300 dark:border-slate-700 last:border-0">
                  <Link href={item.url} className="block py-3 px-1 text-sm text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 2: Job Updates */}
        <div className="flex flex-col">
          <div className="bg-slate-900 dark:bg-black text-white text-center py-3 font-bold text-lg border-b-4 border-emerald-500 sticky top-0 z-10">
            Job Updates
          </div>
          <div className="max-h-[450px] overflow-y-auto custom-thin-scroll bg-slate-50/30 dark:bg-slate-900/50">
            <ul className="flex flex-col px-3">
              {jobUpdates.map(item => (
                <li key={`job-${item.id}`} className="border-b border-dashed border-slate-300 dark:border-slate-700 last:border-0">
                  <Link href={`/jobs/${item.id}`} className="block py-3 px-1 text-sm text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
