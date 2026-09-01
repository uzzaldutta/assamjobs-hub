
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { BookOpen, Target, ChevronRight, Search, Activity, BookMarked } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Competitive Exams Preparation | AssamJobs Hub",
  description: "Prepare for ADRE, Assam Police, APSC and other competitive exams with structured syllabus, mock tests, and free study materials.",
};

// Next.js 14/15 Server Component for high performance and SEO
export default async function ExamsDirectoryPage() {
  // Fetch all active exams securely on the server
  const { data: exams } = await supabase
    .from("prep_exams")
    .select("id, title, slug, description, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PageHeader 
        title="Prepare for Success"
        subtitle="Discover structured syllabus, practice questions, and mock tests for top competitive exams."
      />
      
      <main className="container mx-auto px-4 mt-8 max-w-6xl">
        {/* Search & Filter - Clean, mobile-first design */}
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-3 mb-8 sticky top-16 z-20">
          <Search className="text-slate-400 ml-2" size={20} />
          <input 
            type="text" 
            placeholder="Search for an exam (e.g., ADRE, Assam Police)..." 
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder:text-slate-400 text-base"
          />
        </div>

        {/* Exam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams && exams.length > 0 ? (
            exams.map((exam) => (
              <Link href={`/exam/${exam.slug}`} key={exam.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                
                {/* Decorative background accent */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                
                <div className="relative z-10 flex-1">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                    <Target size={24} strokeWidth={2.5} />
                  </div>
                  
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {exam.title}
                  </h2>
                  
                  {exam.description && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {exam.description}
                    </p>
                  )}
                </div>

                <div className="relative z-10 mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <BookMarked size={14} className="text-emerald-500" /> Syllabus
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Activity size={14} className="text-orange-500" /> Tests
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors text-slate-400">
                    <ChevronRight size={16} strokeWidth={3} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Exams Available Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">We are currently preparing high-quality syllabus and mock tests. Please check back soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
