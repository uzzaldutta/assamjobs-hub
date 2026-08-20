"use client";

import { useState, useEffect } from "react";
import { Bookmark, AlertCircle } from "lucide-react";
import Link from "next/link";
import JobCard from "@/components/JobCard";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem("saved_jobs") || "[]");
      setSavedJobs(saved);
    };

    loadSaved();
    
    // Listen for custom event in case user unsaves a job from this page
    window.addEventListener('saved_jobs_updated', loadSaved);
    return () => window.removeEventListener('saved_jobs_updated', loadSaved);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-slate-800 dark:bg-slate-900 px-4 pt-6 pb-8 md:pb-6 rounded-b-[2rem] md:rounded-2xl shadow-lg relative z-0 md:mt-4 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Bookmark className="fill-indigo-400 text-indigo-400" />
          Saved Updates
        </h2>
        <p className="text-slate-300 text-sm mb-2">Your personal collection of jobs, tenders, and results.</p>
      </div>

      <div className="px-4 md:px-0 relative z-10 max-w-3xl mx-auto w-full mt-6">
        {savedJobs.length > 0 ? (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-4">
            <Bookmark className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No saved updates yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto text-sm">
              Click the bookmark icon on any job, result, or tender to save it here for later.
            </p>
            <Link 
              href="/" 
              className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-xl transition"
            >
              Browse Latest Updates
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
