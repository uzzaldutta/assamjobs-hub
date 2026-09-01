client_code = """
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, GraduationCap, Briefcase, Calendar, ChevronRight, Bookmark, BookmarkCheck, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SearchClient({ initialQuery, initialType, results }: { initialQuery: string, initialType: string, results: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState(initialType);
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ajh_saved_jobs") || "{}");
      setSavedJobs(saved);
    } catch(e) {}
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return router.push("/search");
    
    // Save to recent searches
    try {
      const recent = JSON.parse(localStorage.getItem("ajh_recent_searches") || "[]");
      const updated = [query.trim(), ...recent.filter((q:string) => q.toLowerCase() !== query.trim().toLowerCase())].slice(0, 5);
      localStorage.setItem("ajh_recent_searches", JSON.stringify(updated));
    } catch(e) {}

    const params = new URLSearchParams(searchParams.toString());
    params.set("q", query.trim());
    router.push(`/search?${params.toString()}`);
  };

  const setTypeFilter = (type: string) => {
    setActiveType(type);
    const params = new URLSearchParams(searchParams.toString());
    if (type === "ALL") params.delete("type");
    else params.set("type", type);
    router.push(`/search?${params.toString()}`);
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSaved = { ...savedJobs, [id]: !savedJobs[id] };
    setSavedJobs(newSaved);
    localStorage.setItem("ajh_saved_jobs", JSON.stringify(newSaved));
  };

  // Grouping logic
  const jobs = results.filter(r => r.item_type === "JOB");
  const exams = results.filter(r => r.item_type === "EXAM");
  const topics = results.filter(r => r.item_type === "TOPIC");
  
  // Apply tab filter
  const displayedResults = activeType === "ALL" ? results : results.filter(r => r.item_type === activeType);

  const renderJobCard = (item: any) => (
    <Link href={`/job/${item.item_id}`} key={item.item_id} className="block group">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md relative">
        <button 
          onClick={(e) => toggleSave(item.item_id, e)}
          className="absolute top-5 right-5 text-slate-400 hover:text-indigo-600 transition-colors"
        >
          {savedJobs[item.item_id] ? <BookmarkCheck size={22} className="text-indigo-600 fill-indigo-100 dark:fill-indigo-900" /> : <Bookmark size={22} />}
        </button>
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-white pr-8 leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 font-medium">{item.subtitle}</p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mb-5">
          {item.metadata.location && <div className="flex items-center gap-1.5"><MapPin size={14}/> {item.metadata.location}</div>}
          {item.metadata.qualification && <div className="flex items-center gap-1.5"><GraduationCap size={14}/> {item.metadata.qualification}</div>}
          {item.metadata.job_type && <div className="flex items-center gap-1.5"><Briefcase size={14}/> {item.metadata.job_type}</div>}
          {item.metadata.last_date && <div className="flex items-center gap-1.5 font-medium text-orange-600 dark:text-orange-400"><Calendar size={14}/> Apply by {new Date(item.metadata.last_date).toLocaleDateString()}</div>}
        </div>
        
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
           <span className="text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">GOVERNMENT JOB</span>
           <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
             View Details <ChevronRight size={16}/>
           </span>
        </div>
      </div>
    </Link>
  );

  const renderExamCard = (item: any) => (
    <div key={item.item_id} className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-5 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
        <FileText size={100} />
      </div>
      <h3 className="text-xl font-black text-indigo-900 dark:text-indigo-100 mb-2 relative z-10">{item.title}</h3>
      <p className="text-indigo-700/80 dark:text-indigo-300/80 text-sm mb-6 relative z-10 line-clamp-2">{item.metadata.description}</p>
      
      <Link href={`/exam/${item.metadata.slug}`} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors relative z-10 shadow-sm">
        View Syllabus & Prepare <ArrowRight size={16}/>
      </Link>
    </div>
  );

  const renderTopicCard = (item: any) => (
    <Link href={`/practice/${item.item_id}`} key={item.item_id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-500 group transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-bold">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors">{item.title}</h4>
          <p className="text-xs text-slate-500">{item.subtitle}</p>
        </div>
      </div>
      <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Practice</span>
    </Link>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-16 z-40">
        <form onSubmit={handleSearch} className="relative flex items-center mb-4">
          <Search className="absolute left-4 text-slate-400" size={20} />
          <input 
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-24 py-3.5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-500 rounded-xl font-medium text-slate-900 dark:text-white outline-none transition-all"
          />
          <button type="submit" className="absolute right-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-lg text-sm hover:bg-slate-800 transition-colors">
            Update
          </button>
        </form>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => setTypeFilter('ALL')} className={`whitespace-nowrap px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeType === 'ALL' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
            All ({results.length})
          </button>
          {jobs.length > 0 && (
            <button onClick={() => setTypeFilter('JOB')} className={`whitespace-nowrap px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeType === 'JOB' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
              Jobs ({jobs.length})
            </button>
          )}
          {exams.length > 0 && (
            <button onClick={() => setTypeFilter('EXAM')} className={`whitespace-nowrap px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeType === 'EXAM' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
              Exams ({exams.length})
            </button>
          )}
          {topics.length > 0 && (
            <button onClick={() => setTypeFilter('TOPIC')} className={`whitespace-nowrap px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeType === 'TOPIC' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
              Practice Topics ({topics.length})
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20 px-4">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Search size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">No exact matches</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">We couldn't find anything exactly matching "{initialQuery}". Check for typos or try broader terms.</p>
          <div className="flex justify-center gap-2">
            <button onClick={() => { setQuery("Assam Police"); handleSearch({preventDefault:()=> {}} as any); }} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold">Try "Assam Police"</button>
            <button onClick={() => { setQuery("ADRE"); handleSearch({preventDefault:()=> {}} as any); }} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold">Try "ADRE"</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Results Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* CROSS-CONTENT DISCOVERY VIEW (Only when ALL is selected) */}
            {activeType === "ALL" ? (
              <>
                {/* 1. Best Match / Job */}
                {jobs.length > 0 && (
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                       Opportunity
                    </h2>
                    <div className="space-y-4">
                      {jobs.slice(0, 3).map(renderJobCard)}
                    </div>
                  </div>
                )}
                
                {/* 2. Prepare For This */}
                {(exams.length > 0 || topics.length > 0) && (
                  <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-200 dark:border-slate-800">
                     <h2 className="text-sm font-black uppercase tracking-widest text-indigo-500 mb-4 flex items-center gap-2">
                       Prepare for this
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       {exams.slice(0, 2).map(renderExamCard)}
                     </div>
                     <div className="space-y-3">
                       {topics.slice(0, 4).map(renderTopicCard)}
                     </div>
                  </div>
                )}

                {/* 3. Related Jobs */}
                {jobs.length > 3 && (
                  <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-200 dark:border-slate-800">
                     <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                       More Related Jobs
                     </h2>
                     <div className="space-y-4">
                       {jobs.slice(3, 8).map(renderJobCard)}
                     </div>
                  </div>
                )}
              </>
            ) : (
              // FLAT LIST VIEW (When a specific tab is selected)
              <div className="space-y-4">
                {displayedResults.map(item => {
                  if (item.item_type === "JOB") return renderJobCard(item);
                  if (item.item_type === "EXAM") return renderExamCard(item);
                  if (item.item_type === "TOPIC") return renderTopicCard(item);
                  return null;
                })}
              </div>
            )}
          </div>

          {/* Desktop Filter Sidebar (Placeholder for full filter logic) */}
          <div className="hidden lg:block space-y-6">
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-40">
                <h3 className="font-black text-slate-800 dark:text-white mb-4">Filter Results</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Job Type</label>
                    <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                      <option>Any Type</option>
                      <option>Government</option>
                      <option>Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Qualification</label>
                    <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                      <option>Any</option>
                      <option>10th Pass</option>
                      <option>12th Pass</option>
                      <option>Graduate</option>
                    </select>
                  </div>
                </div>
                <button className="w-full mt-6 py-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors">Apply Filters</button>
             </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
"""
with open("src/app/search/SearchClient.tsx", "w", encoding="utf-8") as f:
    f.write(client_code)
