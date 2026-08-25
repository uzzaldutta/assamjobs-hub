"use client";

import { useState } from "react";
import { Building2, MapPin, Calendar, Clock, ArrowRight, IndianRupee, FileText } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, parseISO, isPast } from "date-fns";

export default function TendersDashboard({ initialTenders }: { initialTenders: any[] }) {
  const [district, setDistrict] = useState("ALL");
  const [department, setDepartment] = useState("ALL");
  const [search, setSearch] = useState("");

  // Extract unique departments and districts
  const departments = Array.from(new Set(initialTenders.map(t => t.organization))).filter(Boolean);
  const districts = Array.from(new Set(initialTenders.map(t => t.district))).filter(Boolean);

  const filtered = initialTenders.filter(tender => {
    const matchesDistrict = district === "ALL" || tender.district === district;
    const matchesDept = department === "ALL" || tender.organization === department;
    const matchesSearch = (tender.title || "").toLowerCase().includes(search.toLowerCase()) || 
                          (tender.organization || "").toLowerCase().includes(search.toLowerCase());
    return matchesDistrict && matchesDept && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      
      {/* Professional Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-8 shadow-sm">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileText size={16} /> Filter Active Tenders
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text"
            placeholder="Search keyword or tender ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          
          <select 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept: any) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
          >
            <option value="ALL">All Districts</option>
            {districts.map((dist: any) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tenders List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">No tenders match your filters.</p>
          </div>
        ) : (
          filtered.map(tender => {
            const closingDate = tender.lastDate ? parseISO(tender.lastDate) : null;
            const timeRemaining = closingDate ? (isPast(closingDate) ? 'Closed' : formatDistanceToNow(closingDate)) : 'TBD';
            const isUrgent = timeRemaining.includes('days') && parseInt(timeRemaining) <= 3;

            return (
              <div key={tender.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {tender.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium mb-4 md:mb-0">
                    <div className="flex items-center gap-1.5"><Building2 size={16} /> {tender.organization}</div>
                    <div className="flex items-center gap-1.5"><MapPin size={16} /> {tender.district || "Assam"}</div>
                    {/* Placeholder for value if not in DB yet */}
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold"><IndianRupee size={16} /> {tender.value || "Rate Contract"}</div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                  <div className={`flex items-center gap-1.5 text-sm font-bold ${isUrgent ? 'text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded-lg' : 'text-slate-500'}`}>
                    <Clock size={16} /> Closes in {timeRemaining}
                  </div>
                  
                  <Link href={`/jobs/${tender.id}`} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
                    View Tender <ArrowRight size={16} />
                  </Link>
                </div>
                
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
