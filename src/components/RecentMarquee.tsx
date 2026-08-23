import Link from "next/link";

interface Job {
  id: string;
  title: string;
  organization: string;
  type: string;
  category: string;
  vacancies?: string;
  district?: string;
  lastDate?: string;
}

interface RecentMarqueeProps {
  jobs: Job[];
  title: string;
}

export default function RecentMarquee({ jobs, title }: RecentMarqueeProps) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="w-full mt-6 mb-8">
      <div className="flex items-center gap-2 mb-4 px-4 md:px-0">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
      </div>
      
      <div className="flex overflow-hidden relative w-full group py-2">
        {/* We render two identical lists side-by-side to create the seamless infinite scroll effect */}
        {[1, 2].map((listIndex) => (
          <div key={listIndex} className="flex gap-4 min-w-max animate-marquee pr-4" aria-hidden={listIndex === 2}>
            {jobs.map((job) => (
              <Link key={`${listIndex}-${job.id}`} href={`/jobs/${job.id}`} className="w-[300px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                      {job.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">New</span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                    {job.title}
                  </h4>
                </div>
                <div className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="truncate max-w-[150px]">{job.organization}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
