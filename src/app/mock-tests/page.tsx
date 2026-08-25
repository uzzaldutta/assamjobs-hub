"use client";

import Link from "next/link";
import { BookOpen, Award, Clock, ArrowRight, Target, Flame, Activity } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useMockTests } from "@/hooks/useMockTests";

export default function MockTestsIndex() {
  const { isLoaded, testsCompleted, averageScore, results } = useMockTests();

  const tests = [
    {
      id: "assam-gk",
      title: "Assam History & Culture (Set 1)",
      category: "Assam GK",
      questions: 10,
      time: "10 Mins",
      color: "border-blue-200 hover:border-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    {
      id: "english-grammar",
      title: "General English (Grammar)",
      category: "English",
      questions: 5,
      time: "5 Mins",
      color: "border-violet-200 hover:border-violet-500",
      bg: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
    },
    {
      id: "logical-reasoning",
      title: "Logical Reasoning (Basic)",
      category: "Reasoning",
      questions: 5,
      time: "5 Mins",
      color: "border-emerald-200 hover:border-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
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
