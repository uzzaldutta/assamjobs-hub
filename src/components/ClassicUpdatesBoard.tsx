import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { format } from "date-fns";

export default async function ClassicUpdatesBoard() {
  // Fetch Jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, scraped_at, job_type, category')
    .eq('status', 'PUBLISHED')
    .neq('category', 'BANNED_KEYWORD')
    .order('scraped_at', { ascending: false })
    .limit(20);

  // Fetch Results
  const { data: results } = await supabase
    .from('results')
    .select('id, title, created_at')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch Admissions
  const { data: admissions } = await supabase
    .from('jobs')
    .select('id, title, scraped_at')
    .eq('status', 'PUBLISHED')
    .eq('job_type', 'ADMISSION')
    .order('scraped_at', { ascending: false })
    .limit(10);

  // Fetch Scholarships
  const { data: scholarships } = await supabase
    .from('scholarships')
    .select('id, title, created_at')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false })
    .limit(10);

  // Column 2: Job Updates
  const jobUpdates = jobs?.slice(0, 15) || [];

  // Column 3: Exam Results
  const examResults = results?.slice(0, 15) || [];

  // Column 1: Latest Updates (Mix of everything else)
  const latestUpdates = [
    ...(jobs?.slice(0, 5).map(j => ({ id: j.id, title: j.title, date: j.scraped_at, url: `/jobs/${j.id}` })) || []),
    ...(results?.slice(0, 5).map(r => ({ id: r.id, title: r.title, date: r.created_at, url: `/results/${r.id}` })) || []),
    ...(admissions?.map(a => ({ id: a.id, title: a.title, date: a.scraped_at, url: `/jobs/${a.id}` })) || []),
    ...(scholarships?.map(s => ({ id: s.id, title: s.title, date: s.created_at, url: `/scholarships/${s.id}` })) || [])
  ]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 15);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
        
        {/* Column 1: Latest Updates */}
        <div className="flex flex-col">
          <div className="bg-slate-900 dark:bg-black text-white text-center py-3 font-bold text-lg border-b-4 border-purple-500">
            Latest Updates
          </div>
          <ul className="flex flex-col px-2">
            {latestUpdates.map(item => (
              <li key={`latest-${item.id}`} className="border-b border-dashed border-slate-300 dark:border-slate-700 last:border-0">
                <Link href={item.url} className="block py-3 px-2 text-sm text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Job Updates */}
        <div className="flex flex-col">
          <div className="bg-slate-900 dark:bg-black text-white text-center py-3 font-bold text-lg border-b-4 border-emerald-500">
            Job Updates
          </div>
          <ul className="flex flex-col px-2">
            {jobUpdates.map(item => (
              <li key={`job-${item.id}`} className="border-b border-dashed border-slate-300 dark:border-slate-700 last:border-0">
                <Link href={`/jobs/${item.id}`} className="block py-3 px-2 text-sm text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Exam Results */}
        <div className="flex flex-col">
          <div className="bg-slate-900 dark:bg-black text-white text-center py-3 font-bold text-lg border-b-4 border-amber-500">
            Exam Results
          </div>
          <ul className="flex flex-col px-2">
            {examResults.map(item => (
              <li key={`result-${item.id}`} className="border-b border-dashed border-slate-300 dark:border-slate-700 last:border-0">
                <Link href={`/results/${item.id}`} className="block py-3 px-2 text-sm text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
