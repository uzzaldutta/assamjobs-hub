"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isThisWeek, parseISO, isAfter, isBefore, addDays } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    async function fetchJobs() {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .not('last_date', 'is', null);
      
      if (data) setJobs(data);
      setLoading(false);
    }
    fetchJobs();
  }, []);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Get jobs closing on a specific date
  const getJobsClosingOn = (date: Date) => {
    return jobs.filter(job => {
      if (!job.last_date) return false;
      const jobDate = parseISO(job.last_date);
      if (filter === "GOVT" && job.job_type !== "GOVERNMENT") return false;
      if (filter === "ADMISSION" && job.job_type !== "ADMISSION") return false;
      if (filter === "TENDER" && job.job_type !== "TENDER") return false;
      return isSameDay(jobDate, date);
    });
  };

  const getJobsClosingThisWeek = () => {
    return jobs.filter(job => {
      if (!job.last_date) return false;
      const jobDate = parseISO(job.last_date);
      return isThisWeek(jobDate) && isAfter(jobDate, new Date());
    });
  };

  const selectedDateJobs = selectedDate ? getJobsClosingOn(selectedDate) : [];
  const closingThisWeek = getJobsClosingThisWeek();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PageHeader 
        title="Application Deadlines" 
        subtitle="Never miss an important date again"
        theme="blue"
      />

      <div className="max-w-5xl mx-auto w-full px-4 py-6">
        
        {/* Filters */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
          {["ALL", "GOVT", "ADMISSION", "TENDER"].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
            >
              {f === "ALL" ? "All Updates" : f === "GOVT" ? "Govt Jobs" : f === "ADMISSION" ? "Admissions" : "Tenders"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar Widget */}
          <div className="col-span-1 lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"><ChevronLeft size={20} /></button>
                <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"><ChevronRight size={20} /></button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-xs font-bold text-slate-400 py-1">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: daysInMonth[0].getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                
                {daysInMonth.map(date => {
                  const closingJobs = getJobsClosingOn(date);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isTodayDate = isToday(date);
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all aspect-square ${isSelected ? 'bg-blue-600 text-white shadow-md font-bold' : isTodayDate ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                    >
                      <span className="text-sm">{format(date, 'd')}</span>
                      
                      {/* Dots indicator */}
                      {closingJobs.length > 0 && (
                        <div className="absolute bottom-1 flex gap-0.5">
                          {closingJobs.slice(0, 3).map((_, i) => (
                            <span key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-red-500'}`}></span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deadlines List */}
          <div className="col-span-1 lg:col-span-2">
            
            {/* Selected Date */}
            <div className="mb-8">
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                Closing on {selectedDate ? format(selectedDate, 'dd MMMM yyyy') : 'Selected Date'}
              </h3>
              
              {selectedDateJobs.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 text-center border border-slate-100 dark:border-slate-800">
                  <CalendarIcon size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-slate-500 font-medium">No deadlines on this date.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateJobs.map(job => (
                    <Link href={`/jobs/${job.id}`} key={job.id} className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">Deadline Today</span>
                          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{job.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{job.organization}</p>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming This Week */}
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                Closing This Week
              </h3>
              
              {closingThisWeek.length === 0 ? (
                <p className="text-slate-500 text-sm">Nothing closing this week.</p>
              ) : (
                <div className="space-y-3">
                  {closingThisWeek.map(job => (
                    <Link href={`/jobs/${job.id}`} key={job.id} className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">{job.title}</h4>
                          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <Clock size={12} className="text-orange-500" /> Closes on {format(parseISO(job.last_date), 'MMM dd')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
