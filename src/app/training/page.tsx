import JobCard from "@/components/JobCard";
import { Search } from "lucide-react";

const mockTraining = [
  {
    id: "t1",
    title: "Montessori Teacher Training",
    organization: "PERI Montessori Training",
    type: "TRAINING" as const,
    category: "SPECIALIZED_TRAINING",
    vacancies: "Limited Seats",
    district: "Guwahati / Online",
    lastDate: "2026-09-10"
  },
  {
    id: "t2",
    title: "Web Development Bootcamp",
    organization: "Assam Skill Development Mission",
    type: "TRAINING" as const,
    category: "GOVT_INITIATIVE",
    vacancies: "100",
    district: "Jorhat",
    lastDate: "2026-09-01"
  },
];

export default function TrainingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-amber-600 dark:bg-amber-900 px-4 pt-6 pb-12 md:pb-10 rounded-b-[2rem] md:rounded-2xl shadow-lg relative z-0 md:mt-4 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-white mb-1">Specialized Training</h2>
        <p className="text-amber-100 text-sm mb-5">Upskill yourself with top certifications and courses</p>
        
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 sm:text-sm shadow-md" 
            placeholder="Search courses or institutes..." 
          />
        </div>
      </div>

      <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Featured Programs</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTraining.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
