import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { 
  Search, 
  Activity, 
  FileCheck, 
  ArrowRight, 
  Clock, 
  Hash, 
  Award, 
  PlayCircle, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  AlertCircle 
} from "lucide-react";

export const revalidate = 3600; // 1 hour caching with on-demand revalidation

export default async function MockTestsPage(props: { searchParams?: Promise<{ [key: string]: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q?.trim() || "";
  const selectedExam = searchParams?.exam || "all";
  const sort = searchParams?.sort || "newest";

  // 1. Fetch all published exams for filter tabs
  const { data: exams } = await supabase
    .from('prep_exams')
    .select('id, title, slug')
    .eq('status', 'PUBLISHED')
    .order('title', { ascending: true });

  // 2. Fetch mock tests with exam relationship
  let queryBuilder = supabase
    .from('prep_mock_tests')
    .select('*, prep_exams(id, title, slug), prep_mock_test_questions(count)')
    .eq('status', 'PUBLISHED');

  if (q) {
    queryBuilder = queryBuilder.ilike('title', `%${q}%`);
  }

  if (sort === 'newest') {
    queryBuilder = queryBuilder.order('created_at', { ascending: false });
  } else {
    queryBuilder = queryBuilder.order('title', { ascending: true });
  }

  const { data: rawTests } = await queryBuilder;

  // 3. Exam counts calculation
  const allTests = rawTests || [];
  const examCounts: Record<string, number> = { all: allTests.length };
  exams?.forEach(e => {
    examCounts[e.slug] = allTests.filter(t => t.prep_exams?.slug === e.slug).length;
  });

  // 4. Filter tests by selected exam
  const filteredTests = selectedExam === "all" 
    ? allTests 
    : allTests.filter(t => t.prep_exams?.slug === selectedExam);

  // Helper for exam short labels
  const getExamShortName = (title: string) => {
    if (title.toLowerCase().includes('adre')) return 'ADRE 2.0';
    if (title.toLowerCase().includes('police')) return 'Assam Police';
    if (title.toLowerCase().includes('apsc')) return 'APSC CCE';
    if (title.toLowerCase().includes('tet')) return 'Assam TET';
    return title.split('(')[0].trim();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <PageHeader 
        title="Mock Tests & Practice" 
        subtitle="Simulated full-length mock tests for ADRE 2.0, Assam Police, APSC CCE, Assam TET, and State Exams." 
        theme="purple" 
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Header Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <form action="/mock-tests" method="GET" className="flex-1 max-w-xl flex items-center bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:border-indigo-500 transition-colors">
            {selectedExam !== 'all' && (
              <input type="hidden" name="exam" value={selectedExam} />
            )}
            <div className="relative flex-1">
              <input 
                type="text" 
                name="q" 
                defaultValue={q} 
                placeholder="Search mock tests by topic or exam..." 
                className="w-full bg-transparent py-2.5 pl-11 pr-4 text-slate-900 dark:text-white outline-none font-medium text-sm placeholder:text-slate-400"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-sm">
              Search
            </button>
          </form>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm self-start md:self-auto">
            <Sparkles size={16} className="text-amber-500 animate-pulse" />
            <span>{filteredTests.length} {filteredTests.length === 1 ? 'Test' : 'Tests'} Available • Free Access</span>
          </div>
        </div>

        {/* Exam-Wise Filter Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            {/* All Exams Tab */}
            <Link
              href={`/mock-tests?${new URLSearchParams({ ...(q ? { q } : {}), exam: 'all' })}`}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap shadow-sm ${
                selectedExam === 'all'
                  ? 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-slate-800'
              }`}
            >
              <GraduationCap size={16} />
              <span>All Exams</span>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                selectedExam === 'all' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {examCounts.all || 0}
              </span>
            </Link>

            {/* Dynamic Exam Tabs */}
            {exams?.map((exam) => {
              const isActive = selectedExam === exam.slug;
              const count = examCounts[exam.slug] || 0;
              return (
                <Link
                  key={exam.id}
                  href={`/mock-tests?${new URLSearchParams({ ...(q ? { q } : {}), exam: exam.slug })}`}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap shadow-sm ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCheck size={16} />
                  <span>{getExamShortName(exam.title)}</span>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test: any) => {
            const questionCount = test.prep_mock_test_questions?.[0]?.count ?? null;
            return (
              <div 
                key={test.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col group relative overflow-hidden"
              >
                {/* Top Pill Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60 flex items-center gap-1.5">
                    <Award size={12} className="text-indigo-600 dark:text-indigo-400" />
                    {test.prep_exams ? getExamShortName(test.prep_exams.title) : 'Assam Govt'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                    FREE LIVE TEST
                  </span>
                </div>
                
                {/* Title */}
                <Link href={`/mock-tests/${test.id}`} className="block">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {test.title}
                  </h3>
                </Link>
                
                {test.prep_exams && (
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                    <FileCheck size={14} className="text-slate-400" />
                    {test.prep_exams.title}
                  </p>
                )}

                {/* Test Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 mb-6 mt-auto">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                     <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Duration</span>
                     <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1">
                       <Clock size={12} className="text-slate-400"/> {test.duration_minutes || 60}m
                     </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                     <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Marks</span>
                     <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1">
                       <Hash size={12} className="text-slate-400"/> {test.total_marks || '--'}
                     </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                     <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Questions</span>
                     <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
                       <ShieldCheck size={12}/> {questionCount !== null ? `${questionCount} Qs` : 'Full'}
                     </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Link 
                    href={`/practice/${test.id}?type=mock`}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs md:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow"
                  >
                    <PlayCircle size={16} />
                    <span>Start Test</span>
                  </Link>
                  <Link 
                    href={`/mock-tests/${test.id}`}
                    aria-label={`View details for ${test.title}`}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
            <Activity size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Mock Tests Found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 text-sm">
              {q ? `No mock tests matching "${q}".` : 'No mock tests currently available in this exam category.'}
            </p>
            <Link 
              href="/mock-tests" 
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-sm transition-colors"
            >
              View All Mock Tests
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
