"use client";

import { useBookmarks } from "@/hooks/useBookmarks";
import JobCard from "@/components/JobCard";
import Link from "next/link";
import { Bookmark, ArrowLeft } from "lucide-react";

export default function SavedJobsPage() {
  const { savedJobs, isLoaded } = useBookmarks();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page Header (Unified Pattern) */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="text-indigo-600 dark:text-indigo-400" /> Saved Opportunities
          </h1>
          <p className="text-slate-500 text-sm font-medium">Access your bookmarked jobs and exams.</p>
        </div>
      </div>

      {!isLoaded ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark size={32} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No saved items yet</h2>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            Click the bookmark icon on any job, exam, or admission update to save it here for quick access later.
          </p>
          <Link href="/" className="inline-flex items-center justify-center bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
