"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Briefcase, Calendar as CalendarIcon, MapPin } from "lucide-react";
import Link from "next/link";
import FraudWarningBanner from "@/components/FraudWarningBanner";

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .not('last_date', 'is', null);
      
      if (data) {
        setJobs(data);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate empty days for the first row to align correctly (0 = Sunday, 1 = Monday)
  const startDayOfWeek = getDay(monthStart);
  const paddingDays = Array.from({ length: startDayOfWeek }).map((_, i) => i);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Get jobs for the selected day
  const selectedJobs = selectedDate 
    ? jobs.filter(job => job.last_date && isSameDay(parseISO(job.last_date), selectedDate))
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 max-w-7xl mx-auto w-full">
      
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 md:p-10 mb-8 shadow-xl text-white">
        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3 mb-2">
          <CalendarIcon size={36} /> Job Deadlines Calendar
        </h1>
        <p className="text-indigo-100 max-w-2xl text-sm md:text-base">
          Never miss an application deadline again. Track upcoming last dates for Government, Private, and Tender applications across Assam.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Calendar Grid Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {paddingDays.map(i => (
              <div key={`pad-${i}`} className="aspect-square rounded-2xl bg-slate-50/50 dark:bg-slate-800/20" />
            ))}
            
            {daysInMonth.map(day => {
              const jobsOnDay = jobs.filter(j => j.last_date && isSameDay(parseISO(j.last_date), day));
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all border-2 
                    ${isSelected ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-transparent hover:border-indigo-200 bg-slate-50 dark:bg-slate-800/50'}
                  `}
                >
                  <span className={`font-semibold text-sm ${isToday ? 'bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center' : 'text-slate-700 dark:text-slate-300'}`}>
                    {format(day, 'd')}
                  </span>
                  
                  {jobsOnDay.length > 0 && (
                    <div className="absolute bottom-2 flex gap-1 justify-center w-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.6)]"></div>
                      {jobsOnDay.length > 1 && <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Section */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
              <span>{selectedDate ? format(selectedDate, 'MMM do, yyyy') : "Select a Date"}</span>
              {selectedJobs.length > 0 && (
                <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs px-2.5 py-1 rounded-full font-bold">
                  {selectedJobs.length} Deadline{selectedJobs.length > 1 ? 's' : ''}
                </span>
              )}
            </h3>

            {loading ? (
              <div className="text-center py-10 text-slate-400 animate-pulse">Loading calendar data...</div>
            ) : !selectedDate ? (
              <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                <CalendarIcon size={48} className="mb-3 opacity-20" />
                <p>Click on any date to see jobs closing on that day.</p>
              </div>
            ) : selectedJobs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                  <CalendarIcon size={24} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p>No deadlines on this day.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedJobs.map(job => (
                  <div key={job.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-colors group bg-slate-50/50 dark:bg-slate-900/50">
                    <span className="text-[9px] uppercase font-bold text-slate-500 mb-1 block">
                      {job.job_type.replace('_', ' ')}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex flex-col gap-1.5 mb-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5"><Briefcase size={12}/> {job.organization}</div>
                      <div className="flex items-center gap-1.5"><MapPin size={12}/> {job.district || "Assam"}</div>
                    </div>
                    <Link href={`/jobs/${job.id}`} className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded-xl transition">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}
