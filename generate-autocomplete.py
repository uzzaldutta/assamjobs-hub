autocomplete_code = """
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Suggestion {
  id: string;
  type: string;
  title: string;
}

export default function SearchAutocomplete({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase.rpc("global_discovery_search", {
        search_query: query.trim()
      });
      
      if (!error && data) {
        // Limit to 6 best suggestions to keep it clean
        setSuggestions(data.slice(0, 6).map((r: any) => ({
          id: r.item_id,
          type: r.item_type,
          title: r.title
        })));
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelect = (sug: Suggestion) => {
    setIsOpen(false);
    // Depending on type, we could route directly to the entity, or just search for the title.
    // Given the prompt: "The user should not need to perform four separate searches.",
    // routing them to the cross-content discovery page for that title is actually better!
    router.push(`/search?q=${encodeURIComponent(sug.title)}`);
  };

  const jobs = suggestions.filter(s => s.type === "JOB");
  const exams = suggestions.filter(s => s.type === "EXAM");
  const prep = suggestions.filter(s => s.type === "TOPIC");

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => { if (query.length > 1) setIsOpen(true); }}
          placeholder="Search jobs, exams..."
          className="w-full pl-9 pr-10 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 border-2 focus:border-indigo-500 rounded-xl text-sm font-medium text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-500"
        />
        {loading && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
          </div>
        )}
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {jobs.length > 0 && (
             <div className="p-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1 mb-1">Jobs</div>
                {jobs.map(s => (
                  <button key={s.id} onClick={() => handleSelect(s)} className="w-full text-left flex items-start gap-2 px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg group transition-colors">
                    <Briefcase size={14} className="mt-0.5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium line-clamp-1">{s.title}</span>
                  </button>
                ))}
             </div>
          )}

          {exams.length > 0 && (
             <div className="p-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1 mb-1">Exams</div>
                {exams.map(s => (
                  <button key={s.id} onClick={() => handleSelect(s)} className="w-full text-left flex items-start gap-2 px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg group transition-colors">
                    <GraduationCap size={14} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 font-medium line-clamp-1">{s.title}</span>
                  </button>
                ))}
             </div>
          )}

          <button onClick={handleSubmit} className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center gap-1 transition-colors">
            View all results for "{query}" <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
"""

with open("src/components/SearchAutocomplete.tsx", "w", encoding="utf-8") as f:
    f.write(autocomplete_code)
