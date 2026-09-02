client_code = """
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Briefcase, FileText, Target, BookOpen, Clock, Users, ArrowRight } from "lucide-react";
import { PaginatedSearchResult, SearchResultItem } from "@/lib/search/searchTypes";

export default function SearchClient({ initialQuery, initialType, paginatedData }: { initialQuery: string; initialType: string; paginatedData: PaginatedSearchResult }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const results = paginatedData.results;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", query.trim());
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  const setTypeFilter = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!type) params.delete("type");
    else params.set("type", type);
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };
  
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/search?${params.toString()}`);
  };

  const jobs = results.filter((r: SearchResultItem) => r.type === "JOB");
  const exams = results.filter((r: SearchResultItem) => r.type === "EXAM");
  const topics = results.filter((r: SearchResultItem) => r.type === "TOPIC");
  const tests = results.filter((r: SearchResultItem) => r.type === "MOCK_TEST");

  // Render logic...
  const renderItem = (item: SearchResultItem) => {
    if (item.type === "JOB") {
      return (
        <Link key={item.id} href={`/jobs/${item.id}`} className="block p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 hover:shadow-md transition bg-white dark:bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Briefcase size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
              <p className="text-sm text-slate-500 truncate">{item.subtitle}</p>
              {item.metadata?.location && <p className="text-xs text-slate-400 mt-1">{item.metadata.location}</p>}
            </div>
          </div>
        </Link>
      );
    }
    if (item.type === "EXAM") {
      return (
        <Link key={item.id} href={`/exams/${item.metadata?.slug || item.id}`} className="block p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 hover:shadow-md transition bg-white dark:bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
              <p className="text-sm text-slate-500 truncate">{item.metadata?.description || item.subtitle}</p>
            </div>
          </div>
        </Link>
      );
    }
    if (item.type === "TOPIC") {
      return (
        <Link key={item.id} href={`/practice/${item.id}`} className="block p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 hover:shadow-md transition bg-white dark:bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <BookOpen size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
              <p className="text-sm text-slate-500 truncate">{item.subtitle}</p>
            </div>
          </div>
        </Link>
      );
    }
    if (item.type === "MOCK_TEST") {
      return (
        <Link key={item.id} href={`/mock-test/${item.id}`} className="block p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 hover:shadow-md transition bg-white dark:bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Target size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
              <p className="text-sm text-slate-500 truncate">{item.subtitle}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock size={12}/> {item.metadata?.duration_minutes}m</span>
                <span className="flex items-center gap-1"><FileText size={12}/> {item.metadata?.total_marks} Marks</span>
              </div>
            </div>
          </div>
        </Link>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, exams, practice topics, mock tests..."
            className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all sm:text-lg font-medium shadow-sm"
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 font-bold rounded-xl hover:bg-indigo-700 transition">
            Search
          </button>
        </form>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-4 mb-4 hide-scrollbar">
        {[
          { id: "", label: "All Results" },
          { id: "JOB", label: "Jobs" },
          { id: "EXAM", label: "Exams" },
          { id: "TOPIC", label: "Practice Topics" },
          { id: "MOCK_TEST", label: "Mock Tests" }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setTypeFilter(filter.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${initialType === filter.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {!initialQuery ? (
        <div className="text-center py-20 px-4">
          <Search size={64} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Search AssamJobs Hub</h2>
          <p className="text-slate-500 max-w-md mx-auto">Enter a keyword above to find government jobs, private sector openings, exam syllabuses, practice questions, and full mock tests.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 px-4">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No results found</h2>
          <p className="text-slate-500">We couldn't find anything matching "{initialQuery}". Try using different keywords.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {(!initialType || initialType === "EXAM") && exams.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="text-emerald-500" /> Exams & Syllabus
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exams.map(renderItem)}
              </div>
            </div>
          )}

          {(!initialType || initialType === "MOCK_TEST") && tests.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="text-purple-500" /> Mock Tests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tests.map(renderItem)}
              </div>
            </div>
          )}

          {(!initialType || initialType === "TOPIC") && topics.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="text-indigo-500" /> Practice Topics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map(renderItem)}
              </div>
            </div>
          )}

          {(!initialType || initialType === "JOB") && jobs.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Briefcase className="text-blue-500" /> Job Openings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map(renderItem)}
              </div>
            </div>
          )}
          
          {paginatedData.totalCount > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="text-sm font-medium text-slate-500">
                Showing <span className="font-bold text-slate-900 dark:text-white">{((paginatedData.currentPage - 1) * paginatedData.pageSize) + 1}</span> to <span className="font-bold text-slate-900 dark:text-white">{Math.min(paginatedData.currentPage * paginatedData.pageSize, paginatedData.totalCount)}</span> of <span className="font-bold text-slate-900 dark:text-white">{paginatedData.totalCount}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(paginatedData.currentPage - 1)}
                  disabled={!paginatedData.hasPrevious}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <button 
                  onClick={() => handlePageChange(paginatedData.currentPage + 1)}
                  disabled={!paginatedData.hasNext}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
"""

with open("src/app/search/SearchClient.tsx", "w", encoding="utf-8") as f:
    f.write(client_code)
