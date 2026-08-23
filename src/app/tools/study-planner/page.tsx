"use client";

import { useState } from "react";
import { Sparkles, BookOpen, Calendar, Target, AlertCircle, ChevronRight, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { generateStudyPlan } from "@/app/actions/generate-study-plan";

export default function StudyPlanner() {
  const [examName, setExamName] = useState("");
  const [days, setDays] = useState("30");
  const [weakSubjects, setWeakSubjects] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<{period: string, title: string, topics: string[], tip: string}[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) return;

    setLoading(true);
    setError("");
    setPlan([]);

    const result = await generateStudyPlan(examName, parseInt(days), weakSubjects);

    if (result.success) {
      setPlan(result.data);
    } else {
      setError(result.error || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/tools" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 mb-6">
          &larr; Back to all tools
        </Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <BrainCircuit className="w-16 h-16 mx-auto mb-4 opacity-90 relative z-10" />
            <h1 className="text-3xl font-bold mb-2 relative z-10">AI Study Planner</h1>
            <p className="text-blue-100 max-w-md mx-auto relative z-10">Generate a custom day-by-day study timetable optimized for Assam competitive exams.</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleGenerate} className="space-y-6 mb-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Target size={16} className="text-blue-500" /> Which exam are you preparing for?
                </label>
                <input 
                  type="text" 
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. ADRE Grade III, Assam Police SI, APSC CCE" 
                  className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" /> Days left until exam
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    max="365"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-500" /> Weak Subjects (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={weakSubjects}
                    onChange={(e) => setWeakSubjects(e.target.value)}
                    placeholder="e.g. Math, Assam History" 
                    className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !examName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <span className="animate-pulse">Generating your custom plan...</span>
                ) : (
                  <>Generate Study Plan <Sparkles size={18} /></>
                )}
              </button>
            </form>

            {error && (
              <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-2xl flex items-center gap-3 border border-red-200 dark:border-red-800/50">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {plan.length > 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    Your {days}-Day Strategy for {examName}
                  </h3>
                </div>
                
                <div className="relative border-l-2 border-blue-200 dark:border-blue-800 ml-3 space-y-8 pb-4">
                  {plan.map((phase, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute w-6 h-6 bg-blue-500 rounded-full left-[-13px] top-1 border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-sm"></div>
                      
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition">
                        <div className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                          {phase.period}
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                          {phase.title}
                        </h4>
                        
                        <div className="mb-4">
                          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Focus Topics:</p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {phase.topics.map((topic, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <ChevronRight size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/50 flex gap-3">
                          <Sparkles className="text-amber-500 shrink-0 mt-0.5" size={18} />
                          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed"><span className="font-bold">Pro Tip:</span> {phase.tip}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
