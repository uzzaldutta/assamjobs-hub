import { Filter, MapPin, Briefcase, GraduationCap } from "lucide-react";

export default function FilterBar() {
  return (
    <div className="mb-6 sticky top-[60px] z-40 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md pt-2 pb-3 px-4 -mx-4 shadow-[0_4px_6px_-6px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button className="flex items-center gap-1.5 whitespace-nowrap bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
          <Filter size={12} /> All Jobs
        </button>
        <button className="flex items-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition">
          Govt <span className="text-[10px] opacity-70 ml-0.5">চৰকাৰী</span>
        </button>
        <button className="flex items-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition">
          Private <span className="text-[10px] opacity-70 ml-0.5">ব্যক্তিগত</span>
        </button>
        <button className="flex items-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition">
          <MapPin size={12} className="text-indigo-500" /> Guwahati
        </button>
        <button className="flex items-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition">
          <GraduationCap size={12} className="text-indigo-500" /> 10th Pass
        </button>
      </div>
    </div>
  );
}
