"use client";

import Link from "next/link";
import { BookOpen, Award, Clock, ArrowRight, Target, Flame, Activity } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useMockTests } from "@/hooks/useMockTests";

export default function MockTestsIndex() {
  const { isLoaded, testsCompleted, averageScore, results } = useMockTests();

  const tests = [
    {
      id: "assam-history",
      title: "Assam History (Ancient to Modern)",
      category: "Assam GK",
      questions: 20,
      time: "20 Mins",
      color: "border-blue-200 hover:border-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    {
      id: "assam-geography",
      title: "Assam Geography & Economy",
      category: "Assam GK",
      questions: 20,
      time: "20 Mins",
      color: "border-emerald-200 hover:border-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
    },
    {
      id: "assam-culture",
      title: "Assam Art, Culture & Literature",
      category: "Assam GK",
      questions: 20,
      time: "20 Mins",
      color: "border-amber-200 hover:border-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
    },
    {
      id: "english-grammar-1",
      title: "English Grammar & Vocabulary Set 1",
      category: "English",
      questions: 20,
      time: "20 Mins",
      color: "border-violet-200 hover:border-violet-500",
      bg: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
    },
    {
      id: "english-grammar-2",
      title: "English Comprehension & Usage Set 2",
      category: "English",
      questions: 20,
      time: "20 Mins",
      color: "border-fuchsia-200 hover:border-fuchsia-500",
      bg: "bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400"
    },
    {
      id: "logical-reasoning-1",
      title: "Logical Reasoning & Aptitude 1",
      category: "Reasoning",
      questions: 20,
      time: "25 Mins",
      color: "border-rose-200 hover:border-rose-500",
      bg: "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
    },
    {
      id: "logical-reasoning-2",
      title: "Analytical Reasoning & Puzzles 2",
      category: "Reasoning",
      questions: 20,
      time: "25 Mins",
      color: "border-orange-200 hover:border-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
    },
    {
      id: "indian-polity",
      title: "Indian Constitution & Polity",
      category: "Polity",
      questions: 20,
      time: "15 Mins",
      color: "border-sky-200 hover:border-sky-500",
      bg: "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
    },
    {
      id: "general-science",
      title: "General Science & Technology",
      category: "Science",
      questions: 20,
      time: "15 Mins",
      color: "border-teal-200 hover:border-teal-500",
      bg: "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
    },
    {
      id: "current-affairs",
      title: "Latest Current Affairs (National & Assam)",
      category: "Current Affairs",
      questions: 20,
      time: "15 Mins",
      color: "border-indigo-200 hover:border-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PageHeader 
        title="Mock Tests" 
        subtitle="Practice for ADRE, APSC, and Assam Police exams"
        theme="blue"
      />

      <div className="max-w-5xl mx-auto w-full px-4 py-8">
        
        {/* Premium AI Generator Banner */}
        <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 sm:p-10 shadow-xl border border-indigo-500/50 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute -bottom-10 left-10 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 border border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  New Feature
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight tracking-tight">AI Mock Test Generator</h2>
              <p className="text-indigo-100 font-medium text-lg max-w-xl">
                Type any exam name or subject, and our Gemini 3.6 AI will instantly craft a custom 20-question mock test just for you.
              </p>
            </div>
            
            <Link href="/mock-tests/ai-generator" className="shrink-0 w-full md:w-auto bg-white text-indigo-700 hover:bg-slate-50 font-black px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 group-hover:scale-105 active:scale-95">
              Generate Test Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        
        {/* Practice Dashboard */}
        {isLoaded && (
          <div className="mb-10 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2 relative z-10">
              <Target className="text-blue-600 dark:text-blue-400" /> Your Practice Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
              
              {/* Continue Practice */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col justify-between shadow-md">
                <div className="flex items-center gap-2 mb-4 font-bold text-blue-100">
                  <Flame size={20} className="text-orange-300 fill-orange-300" /> Keep the streak alive
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Assam GK (Set 2)</h3>
                  <p className="text-blue-200 text-sm mb-4">Recommended next test</p>
                  <Link href="/mock-tests/assam-gk" className="inline-flex items-center gap-1.5 bg-white text-blue-700 font-bold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                    Start Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Activity size={20} />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider">Tests Completed</span>
                </div>
                <div className="text-4xl font-black text-slate-800 dark:text-white ml-1">{testsCompleted}</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Award size={20} />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider">Average Score</span>
                </div>
                <div className="text-4xl font-black text-slate-800 dark:text-white ml-1">{averageScore}%</div>
              </div>

            </div>
          </div>
        )}

        {/* Available Tests */}
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 uppercase tracking-wider">Available Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tests.map((test) => {
            const hasCompleted = results?.some(r => r.testId === test.id);
            const bestScore = results?.filter(r => r.testId === test.id).sort((a, b) => b.score - a.score)[0];

            return (
              <Link 
                href={`/mock-tests/${test.id}`} 
                key={test.id}
                className={`bg-white dark:bg-slate-900 border-2 ${test.color} dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition-all flex flex-col group`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg ${test.bg}`}>
                    {test.category}
                  </span>
                  
                  {hasCompleted && bestScore && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-800">
                      Score: {bestScore.score}/{bestScore.totalQuestions}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {test.title}
                </h3>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <div className="flex items-center gap-1.5"><BookOpen size={16} /> {test.questions} Qs</div>
                  <div className="flex items-center gap-1.5"><Clock size={16} /> {test.time}</div>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  );
}
