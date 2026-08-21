"use client";

import { useState, useEffect } from "react";
import FeedList from "@/components/FeedList";
import { Bookmark, Search } from "lucide-react";
import Link from "next/link";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage
    const loadSavedJobs = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("saved_jobs") || "[]");
        setSavedJobs(saved);
      } catch (e) {
        console.error("Failed to parse saved jobs", e);
      }
    };

    loadSavedJobs();
    setIsLoaded(true);

    // Listen for custom event to update in real time if they unsave something
    window.addEventListener('saved_jobs_updated', loadSavedJobs);
    return () => window.removeEventListener('saved_jobs_updated', loadSavedJobs);
  }, []);

  if (!isLoaded) return null; // Hydration fix

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 text-center">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Bookmark className="text-indigo-500 fill-indigo-500" size={24} />
          Your Saved Jobs
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-md mx-auto">
          Jobs you bookmark are saved directly to your device so you can view them anytime, even offline.
        </p>
      </div>

      <div className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        {savedJobs.length > 0 ? (
          // Use FeedList but hide filters since they probably don't need district filtering for 5 saved jobs
          <FeedList initialJobs={savedJobs} hideFilters={true} />
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm px-4">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No jobs saved yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 text-sm">
              Tap the bookmark icon on any job card to save it here for quick access later.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md"
            >
              <Search size={18} />
              Browse Latest Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
