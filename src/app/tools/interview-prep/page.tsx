"use client";

import { useState } from "react";
import { Sparkles, Briefcase, Volume2, BookOpen, UserCheck, MessageSquare } from "lucide-react";
import Link from "next/link";
import { generateInterviewQuestions } from "@/app/actions/generate-interview";

export default function InterviewPrep() {
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<{category: string, question: string, tip: string, sampleAnswer: string}[]>([]);

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

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = 0.9; // Slightly slower for clarity
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/tools" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 mb-6">
          &larr; Back to all tools
        </Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-90 relative z-10" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">AI Interview Coach Pro</h1>
            <p className="text-violet-100 max-w-xl mx-auto relative z-10 text-lg">Generate role-specific interview questions, get expert tips, sample answers, and practice with our interactive audio simulator.</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Assam Police Sub Inspector, SBI Clerk..." 
                  className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-violet-500 transition text-lg"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-8 rounded-2xl transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px] text-lg"
              >
                {loading ? "Analyzing..." : "Start Practice"}
              </button>
            </form>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm border border-red-100">
                {error}
              </div>
            )}

            {questions.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Your Mock Interview</h3>
                  <span className="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 text-sm font-bold px-3 py-1 rounded-full">{questions.length} Questions</span>
                </div>
                
                {questions.map((q, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-violet-300 transition-colors group">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <span className="inline-block px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase rounded-md mb-3 tracking-wider">
                          {q.category}
                        </span>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                          <span className="text-violet-500 mr-2">Q{i + 1}.</span> {q.question}
                        </h4>
                      </div>
                      <button 
                        onClick={() => speak(q.question)}
                        className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors shrink-0 tooltip"
                        title="Read Question Aloud"
                      >
                        <Volume2 size={20} />
                      </button>
                    </div>

                    <div className="space-y-4 mt-6">
                      <div className="flex gap-3 items-start bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <UserCheck className="text-amber-500 shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wide mb-1">Pro Tip</p>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">{q.tip}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 items-start bg-violet-50/50 dark:bg-violet-900/10 p-4 rounded-xl border border-violet-100 dark:border-violet-800/30">
                        <MessageSquare className="text-violet-500 shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wide mb-1">Sample Answer</p>
                          <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium">"{q.sampleAnswer}"</p>
                        </div>
                      </div>
                    </div>
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
