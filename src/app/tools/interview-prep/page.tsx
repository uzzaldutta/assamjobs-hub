"use client";

import { useState } from "react";
import { Sparkles, Briefcase, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { generateInterviewQuestions } from "@/app/actions/generate-interview";

export default function InterviewPrep() {
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<{question: string, tip: string}[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    setLoading(true);
    setError("");
    setQuestions([]);

    const result = await generateInterviewQuestions(jobTitle);

    if (result.success) {
      setQuestions(result.data);
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
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-90 relative z-10" />
            <h1 className="text-3xl font-bold mb-2 relative z-10">AI Interview Coach</h1>
            <p className="text-violet-100 max-w-md mx-auto relative z-10">Instantly generate the most likely interview questions for any specific job role.</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleGenerate} className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Assam Police Sub Inspector, SBI Clerk..." 
                  className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-violet-500 transition"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !jobTitle.trim()}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-4 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-violet-600/20"
              >
                {loading ? (
                  <span className="animate-pulse">Thinking...</span>
                ) : (
                  <>Generate <Sparkles size={18} /></>
                )}
              </button>
            </form>

            {error && (
              <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-2xl flex items-center gap-3 border border-red-200 dark:border-red-800/50">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {questions.length > 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 dark:text-violet-400 text-sm">✓</span>
                  Top {questions.length} Questions for &quot;{jobTitle}&quot;
                </h3>
                
                {questions.map((q, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-violet-300 dark:hover:border-violet-700 transition group">
                    <div className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {q.question}
                        </h4>
                        <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                          <ChevronRight size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                          <p className="text-sm leading-relaxed"><span className="font-bold text-slate-700 dark:text-slate-300">Pro Tip:</span> {q.tip}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && questions.length === 0 && !error && (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-slate-600 dark:text-slate-300 font-medium">Ready to prep?</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto">Enter the exact job title you are interviewing for, and our AI will predict the hardest questions you might face.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
