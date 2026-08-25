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
  createdAt?: string;
}

interface RecentMarqueeProps {
  jobs: Job[];
  title: string;
}

const isExpiringSoon = (dateString?: string) => {
  if (!dateString) return false;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 3600 * 24));
  return diffDays >= 0 && diffDays <= 3;
};

const isNewJob = (dateString?: string) => {
  if (!dateString) return false;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  const diffDays = Math.ceil((today.getTime() - d.getTime()) / (1000 * 3600 * 24));
  return diffDays >= 0 && diffDays <= 2;
};

export default function RecentMarquee({ jobs, title }: RecentMarqueeProps) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="w-full mt-6 mb-8">
      <div className="flex items-center gap-2 mb-4 px-4 md:px-0">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
        </span>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
      </div>
      
      <div className="flex overflow-hidden relative w-full group py-2">
        {/* We render two identical lists side-by-side to create the seamless infinite scroll effect */}
        {[1, 2].map((listIndex) => (
          <div key={listIndex} className="flex gap-4 min-w-max animate-marquee pr-4" aria-hidden={listIndex === 2}>
            {jobs.map((job) => {
              const expiring = isExpiringSoon(job.lastDate);
              const isNew = !expiring && isNewJob(job.createdAt);
              
              let borderClass = 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700';
              if (expiring) {
                borderClass = 'border-red-400 dark:border-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
              } else if (isNew) {
                borderClass = 'border-emerald-400 dark:border-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
              }

              return (
                <Link key={`${listIndex}-${job.id}`} href={`/jobs/${job.id}`} className={`relative overflow-hidden w-[300px] shrink-0 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between cursor-pointer border ${borderClass}`}>
                  
                  {/* Flashing Background Layer */}
                  {expiring && <div className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 animate-pulse pointer-events-none"></div>}
                  {isNew && <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 animate-pulse pointer-events-none"></div>}

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                          {job.type}
                        </span>
                        {expiring ? (
                          <span className="text-[10px] text-red-600 dark:text-red-500 font-bold flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Ends Soon
                          </span>
                        ) : isNew ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> New Match
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">Active</span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                        {job.title}
                      </h4>
                    </div>
                    <div className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span className="truncate max-w-[150px]">{job.organization}</span>
                      {expiring && job.lastDate ? (
                        <span className="text-red-600 dark:text-red-400 font-bold text-[10px] truncate max-w-[100px]">End: {job.lastDate}</span>
                      ) : (
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">Read More &rarr;</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
