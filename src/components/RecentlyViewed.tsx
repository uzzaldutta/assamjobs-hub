"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Briefcase } from "lucide-react";

export default function RecentlyViewed({ currentJob }: { currentJob?: any }) {
  const [recentJobs, setRecentJobs] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recently_viewed_jobs");
    let history: any[] = stored ? JSON.parse(stored) : [];

    if (currentJob) {
      history = history.filter(j => j.id !== currentJob.id);
      
      const simpleJob = {
        id: currentJob.id,
        title: currentJob.title,
        organization: currentJob.organization,
        job_type: currentJob.job_type || currentJob.type
      };
      
      history.unshift(simpleJob);
      
      if (history.length > 5) {
        history = history.slice(0, 5);
      }
      
      localStorage.setItem("recently_viewed_jobs", JSON.stringify(history));
    }
    
    if (currentJob) {
      setRecentJobs(history.filter(j => j.id !== currentJob.id));
    } else {
      setRecentJobs(history);
    }
  }, [currentJob]);

  if (recentJobs.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
        <Clock className="text-emerald-500" /> Recently Viewed By You
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentJobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition group block">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors shrink-0">
                <Briefcase size={16} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {job.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 truncate">{job.organization}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}