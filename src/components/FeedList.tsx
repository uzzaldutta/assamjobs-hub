"use client";

import { useState } from "react";
import JobCard from "./JobCard";
import { Search, Filter, Briefcase, GraduationCap, FileText, Activity } from "lucide-react";

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

  const filteredJobs = initialJobs.filter((job) => {
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

  return (
    <div className="w-full">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        
        {/* Search Bar & Dropdowns */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs or organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="ALL">All Districts</option>
              <option value="Guwahati">Guwahati</option>
              <option value="Kamrup">Kamrup</option>
              <option value="Jorhat">Jorhat</option>
              <option value="Dibrugarh">Dibrugarh</option>
              <option value="Silchar">Silchar</option>
              <option value="Tezpur">Tezpur</option>
              <option value="Nagaon">Nagaon</option>
              <option value="All Assam">All Assam</option>
            </select>
            
            <select
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm"
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
          </div>
        </div>

        {/* Filter Pills */}
        {!hideFilters && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setFilter("ALL")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === "ALL" ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <Activity size={14} /> All Updates
            </button>
            
            <button 
              onClick={() => setFilter("GOVT")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === "GOVT" ? "bg-emerald-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <Briefcase size={14} /> Govt Jobs
            </button>
            
            <button 
              onClick={() => setFilter("PRIVATE")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === "PRIVATE" ? "bg-blue-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <Building2 size={14} /> Private Jobs
            </button>

            <button 
              onClick={() => setFilter("EXAM")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === "EXAM" ? "bg-violet-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <GraduationCap size={14} /> Exams & Results
            </button>
            
            <button 
              onClick={() => setFilter("TENDER")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === "TENDER" ? "bg-orange-500 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              <FileText size={14} /> Tenders
            </button>
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Filter className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No updates found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Try adjusting your search or filters.</p>
            <button onClick={() => {setSearch(""); setFilter("ALL");}} className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// Add the missing import
import { Building2 } from "lucide-react";
