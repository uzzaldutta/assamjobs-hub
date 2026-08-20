import JobCard from "@/components/JobCard";
import { Search } from "lucide-react";

const mockAdmitCards = [
  {
    id: "a1",
    title: "ADRE Grade III Written Test Admit Card",
    organization: "State Level Recruitment Commission",
    type: "EXAM_UPDATE" as const,
    category: "ASSAM_STATE",
    vacancies: "12,000",
    district: "All Assam",
    lastDate: "2026-08-25"
  },
  {
    id: "a2",
    title: "Assam Police SI Physical Test Admit",
    organization: "SLPRB Assam",
    type: "EXAM_UPDATE" as const,
    category: "ASSAM_STATE",
    vacancies: "330",
    district: "Guwahati",
    lastDate: "2026-08-28"
  },
];

export default function AdmitCardsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-indigo-600 dark:bg-indigo-900 px-4 pt-6 pb-12 md:pb-10 rounded-b-[2rem] md:rounded-2xl shadow-lg relative z-0 md:mt-4 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-white mb-1">Download Admit Cards</h2>
        <p className="text-indigo-100 text-sm mb-5">Get the latest hall tickets for upcoming exams</p>
        
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 sm:text-sm shadow-md" 
            placeholder="Search exams or organizations..." 
          />
        </div>
      </div>

      <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Latest Admit Cards</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAdmitCards.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
