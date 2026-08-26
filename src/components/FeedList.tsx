"use client";

import { useState } from "react";
import Link from "next/link";
import JobCard from "./JobCard";
import { Search, Filter, Briefcase, GraduationCap, FileText, Activity, Building2 } from "lucide-react";

export default function FeedList({ 
  initialJobs, 
  defaultFilter = "ALL", 
  hideFilters = false 
}: { 
  initialJobs: any[]; 
  defaultFilter?: string; 
  hideFilters?: boolean; 
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(defaultFilter);
  const [district, setDistrict] = useState("ALL");
  const [qualification, setQualification] = useState("ALL");

  const [sortBy, setSortBy] = useState("newest");

  // State for pagination (Load More)
  const [visibleCount, setVisibleCount] = useState(15);

  let filteredJobs = initialJobs.filter((job) => {
    // 1. Search filter
    const matchesSearch = 
      (job.title || "").toLowerCase().includes(search.toLowerCase()) || 
      (job.organization || "").toLowerCase().includes(search.toLowerCase());
    
    // 2. District filter
    const matchesDistrict = district === "ALL" || (job.district || "").toLowerCase().includes(district.toLowerCase());

    // 3. Qualification filter
    const matchesQualification = qualification === "ALL" || (job.qualification || "").toLowerCase().includes(qualification.toLowerCase());

    // 4. Category filter
    let matchesCategory = true;
    if (filter !== "ALL") {
      const jobType = job.type || job.job_type || "UNKNOWN";
      
      if (filter === "GOVT") {
        matchesCategory = jobType === "GOVERNMENT" || jobType === "ASSAM_STATE" || jobType === "CENTRAL_GOVT";
      } else if (filter === "PRIVATE") {
        matchesCategory = jobType === "PRIVATE" || jobType === "LOCAL_PRIVATE";
      } else if (filter === "EXAM") {
        matchesCategory = jobType === "EXAM_UPDATE" || jobType === "RESULT" || jobType === "ADMIT_CARD";
      } else if (filter === "TENDER") {
        matchesCategory = jobType === "TENDER" || jobType === "INFRASTRUCTURE";
      }
    }

    return matchesSearch && matchesCategory && matchesDistrict && matchesQualification;
  });

  // Apply Sorting
  filteredJobs.sort((a, b) => {
    if (sortBy === "closing_soon") {
      if (!a.lastDate) return 1;
      if (!b.lastDate) return -1;
      const dateA = new Date(a.lastDate).getTime();
      const dateB = new Date(b.lastDate).getTime();
      return dateA - dateB;
    } 
    else if (sortBy === "vacancies") {
      // Extract numbers from vacancy strings like "1,240" or "50+"
      const parseVacancies = (str: string) => parseInt((str || "0").replace(/[^0-9]/g, "")) || 0;
      return parseVacancies(b.vacancies) - parseVacancies(a.vacancies);
    }
    // "newest" defaults to original server order (scraped_at descending)
    return 0; 
  });

  // Reset pagination when filters change
  const handleFilterChange = (setter: any, value: any) => {
    setter(value);
    setVisibleCount(15);
  };

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  return (
    <div className="w-full">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        
        {/* Search Bar & Dropdowns */}
        <div className="flex flex-col gap-3">
          {/* Top Row: Prominent Search Input */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs, exams, or organizations..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm transition"
            />
          </div>
          
          {/* Bottom Row: AI Match & Dropdowns */}
          <div className="flex flex-col md:flex-row gap-2 justify-end w-full">
            <Link href="/ai-match" className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-sm text-sm shrink-0 group w-full md:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              <span>AI Match</span>
            </Link>
            
            <div className="grid grid-cols-2 md:flex md:w-auto gap-2 w-full">
            <select
              value={district}
              onChange={(e) => handleFilterChange(setDistrict, e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="ALL">All Assam (All Districts)</option>
              <option value="Bajali">Bajali</option>
              <option value="Baksa">Baksa</option>
              <option value="Barpeta">Barpeta</option>
              <option value="Biswanath">Biswanath</option>
              <option value="Bongaigaon">Bongaigaon</option>
              <option value="Cachar">Cachar</option>
              <option value="Charaideo">Charaideo</option>
              <option value="Chirang">Chirang</option>
              <option value="Darrang">Darrang</option>
              <option value="Dhemaji">Dhemaji</option>
              <option value="Dhubri">Dhubri</option>
              <option value="Dibrugarh">Dibrugarh</option>
              <option value="Dima Hasao">Dima Hasao</option>
              <option value="Goalpara">Goalpara</option>
              <option value="Golaghat">Golaghat</option>
              <option value="Hailakandi">Hailakandi</option>
              <option value="Hojai">Hojai</option>
              <option value="Jorhat">Jorhat</option>
              <option value="Kamrup">Kamrup</option>
              <option value="Kamrup Metropolitan">Kamrup Metropolitan</option>
              <option value="Karbi Anglong">Karbi Anglong</option>
              <option value="Karimganj">Karimganj</option>
              <option value="Kokrajhar">Kokrajhar</option>
              <option value="Lakhimpur">Lakhimpur</option>
              <option value="Majuli">Majuli</option>
              <option value="Morigaon">Morigaon</option>
              <option value="Nagaon">Nagaon</option>
              <option value="Nalbari">Nalbari</option>
              <option value="Sivasagar">Sivasagar</option>
              <option value="Sonitpur">Sonitpur</option>
              <option value="South Salmara-Mankachar">South Salmara-Mankachar</option>
              <option value="Tamulpur">Tamulpur</option>
              <option value="Tezpur">Tezpur</option>
              <option value="Tinsukia">Tinsukia</option>
              <option value="Udalguri">Udalguri</option>
              <option value="West Karbi Anglong">West Karbi Anglong</option>
            </select>
            
            <select
              value={qualification}
              onChange={(e) => handleFilterChange(setQualification, e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="ALL">All Qualifications</option>
              <option value="10th">10th Pass</option>
              <option value="12th">12th Pass</option>
              <option value="Graduate">Graduate (Any)</option>
              <option value="B.Tech">B.Tech / B.E.</option>
              <option value="Diploma">Diploma</option>
              <option value="ITI">ITI</option>
              <option value="Post Graduate">Post Graduate</option>
            </select>
            
            {/* Sort By Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
              className="w-full col-span-2 md:col-span-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 font-bold shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="closing_soon">Closing Soon</option>
              <option value="vacancies">Most Vacancies</option>
            </select>
          </div>
        </div>
      </div>

        {/* Filter Pills */}
        {!hideFilters && (
          <div className="flex flex-wrap gap-2 pb-2">
            <button 
              onClick={() => handleFilterChange(setFilter, "ALL")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === "ALL" ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <Activity size={14} /> All Updates
            </button>
            
            <button 
              onClick={() => handleFilterChange(setFilter, "GOVT")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === "GOVT" ? "bg-emerald-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <Briefcase size={14} /> Govt Jobs
            </button>
            
            <button 
              onClick={() => handleFilterChange(setFilter, "PRIVATE")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === "PRIVATE" ? "bg-blue-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <Building2 size={14} /> Private Jobs
            </button>

            <button 
              onClick={() => handleFilterChange(setFilter, "EXAM")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === "EXAM" ? "bg-violet-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <GraduationCap size={14} /> Exams & Results
            </button>
            
            <button 
              onClick={() => handleFilterChange(setFilter, "TENDER")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === "TENDER" ? "bg-orange-500 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <FileText size={14} /> Tenders
            </button>
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleJobs.length > 0 ? (
          <>
            {visibleJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
            
            {visibleCount < filteredJobs.length && (
              <div className="pt-6 pb-2 text-center col-span-full">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 15)}
                  className="px-8 py-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-sm rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition shadow-sm inline-flex items-center gap-2"
                >
                  <Activity size={16} />
                  Load More Updates ({filteredJobs.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Filter className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No updates found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Try adjusting your search or filters.</p>
            <button onClick={() => {handleFilterChange(setSearch, ""); handleFilterChange(setFilter, "ALL");}} className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
