
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Briefcase, FileText, Target, BookOpen, Clock, Layers, ArrowRight, GraduationCap, Award, CheckSquare, Download } from "lucide-react";
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

  const categories = [
    { id: "", label: "All Results", icon: Search, color: "text-slate-600 dark:text-slate-400" },
    { id: "JOB", label: "Jobs", items: results.filter((r) => r.type === "JOB"), icon: Briefcase, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { id: "EXAM", label: "Exams", items: results.filter((r) => r.type === "EXAM"), icon: Layers, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { id: "TENDER", label: "Tenders", items: results.filter((r) => r.type === "TENDER"), icon: FileText, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
    { id: "ADMISSION", label: "Admissions", items: results.filter((r) => r.type === "ADMISSION"), icon: GraduationCap, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" },
    { id: "RESULT", label: "Results", items: results.filter((r) => r.type === "RESULT"), icon: CheckSquare, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { id: "ADMIT_CARD", label: "Admit Cards", items: results.filter((r) => r.type === "ADMIT_CARD"), icon: Download, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
    { id: "SCHOLARSHIP", label: "Scholarships", items: results.filter((r) => r.type === "SCHOLARSHIP"), icon: Award, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { id: "STUDY_MATERIAL", label: "Study Materials", items: results.filter((r) => r.type === "STUDY_MATERIAL"), icon: BookOpen, color: "text-teal-500", bg: "bg-teal-100 dark:bg-teal-900/30" },
    { id: "MOCK_TEST", label: "Mock Tests", items: results.filter((r) => r.type === "MOCK_TEST"), icon: Target, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { id: "TOPIC", label: "Practice Topics", items: results.filter((r) => r.type === "TOPIC"), icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" }
  ];

  const getHref = (item: SearchResultItem) => {
    switch (item.type) {
      case 'JOB': return `/jobs/${item.id}`;
      case 'EXAM': return `/exam/${item.metadata?.slug || item.id}`;
      case 'TENDER': return `/tenders/${item.id}`;
      case 'ADMISSION': return `/admissions/${item.id}`;
      case 'RESULT': return `/results/${item.id}`;
      case 'ADMIT_CARD': return `/admit-cards/${item.id}`;
      case 'SCHOLARSHIP': return `/scholarships/${item.id}`;
      case 'STUDY_MATERIAL': return `/study-materials/${item.id}`;
      case 'MOCK_TEST': return `/mock-tests/${item.id}`;
      case 'TOPIC': return `/practice/${item.id}`;
      default: return '#';
    }
  };

  const renderItem = (item: SearchResultItem, cat: any) => {
    const Icon = cat.icon;
    return (
      <Link key={item.id} href={getHref(item)} className="block p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 hover:shadow-md transition bg-white dark:bg-slate-900 group">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${cat.bg} ${cat.color} group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400`}>
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
            <p className="text-sm font-medium text-slate-500 truncate">{item.subtitle}</p>
            
            {/* Metadata Badges if available */}
            {(item.metadata?.last_date || item.metadata?.closing_date || item.metadata?.deadline || item.metadata?.exam_date || item.metadata?.result_date || item.metadata?.duration_minutes) && (
              <div className="flex items-center gap-3 mt-2.5 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded">
                  <Clock size={12}/> 
                  {item.metadata?.last_date || item.metadata?.closing_date || item.metadata?.deadline || item.metadata?.exam_date || item.metadata?.result_date || `${item.metadata?.duration_minutes}m`}
                </span>
                {item.metadata?.total_marks && (
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded">
                    <CheckSquare size={12}/> {item.metadata?.total_marks} Marks
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 relative z-20">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search size={22} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Jobs, Exams, Results, Mock Tests..."
            className="block w-full pl-14 pr-32 py-5 border-2 border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all sm:text-lg font-black shadow-sm"
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 md:px-8 font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
            Search
          </button>
        </form>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-4 mb-4 hide-scrollbar">
        {categories.map(filter => {
          // Hide empty filters unless it's "All Results"
          if (filter.id !== "" && filter.items?.length === 0 && initialType !== filter.id) return null;
          
          return (
            <button
              key={filter.label}
              onClick={() => setTypeFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 border ${initialType === filter.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              {filter.id !== "" && <filter.icon size={14} className={initialType === filter.id ? 'text-indigo-200' : filter.color} />}
              {filter.label} 
              {filter.id !== "" && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${initialType === filter.id ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {filter.items?.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {!initialQuery ? (
        <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <Search size={64} className="mx-auto text-slate-200 dark:text-slate-700 mb-6" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Search AssamJobs Hub</h2>
          <p className="text-slate-500 max-w-md mx-auto">Enter a keyword above to find government jobs, exams, updates, study materials, and mock tests.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No results found</h2>
          <p className="text-slate-500 mb-6">We couldn't find anything matching "{initialQuery}".</p>
          <div className="flex flex-wrap justify-center gap-3">
             <button onClick={() => setQuery("Assam Police")} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 transition-colors">Try "Assam Police"</button>
             <button onClick={() => setQuery("Teacher")} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 transition-colors">Try "Teacher"</button>
             <button onClick={() => setQuery("Scholarship")} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 transition-colors">Try "Scholarship"</button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {categories.filter(c => c.id !== "" && (!initialType || initialType === c.id) && c.items && c.items.length > 0).map(cat => (
            <div key={cat.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end mb-4">
                 <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                   <cat.icon className={cat.color} size={20} /> {cat.label}
                 </h2>
                 {!initialType && cat.items && cat.items.length >= 20 && (
                   <button onClick={() => setTypeFilter(cat.id)} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                     View all {cat.label} &rarr;
                   </button>
                 )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.items?.map(item => renderItem(item, cat))}
              </div>
            </div>
          ))}
          
          {paginatedData.totalCount > 0 && initialType && (
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
