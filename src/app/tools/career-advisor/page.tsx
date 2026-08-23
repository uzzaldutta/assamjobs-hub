"use client";

import { useState } from "react";
import { Compass, Sparkles, Building2, BookOpen, AlertCircle, Briefcase, GraduationCap } from "lucide-react";
import { generateCareerPath } from "@/app/actions/generate-career-path";
import Link from "next/link";

export default function CareerAdvisorPage() {
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!education.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await generateCareerPath(education, skills);
      
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 rounded-2xl mb-4">
            <Compass size={40} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">AI Career Path Advisor</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Not sure which Assam Government jobs you are eligible for? Tell us your qualifications and let our AI analyze the perfect career paths for you.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 mb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <GraduationCap size={16} className="text-indigo-500" /> Highest Education Qualification
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. B.Tech in Civil Engineering, 12th Pass (Arts), B.A. in History" 
                value={education} 
                onChange={(e) => setEducation(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-fuchsia-500 outline-none transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Briefcase size={16} className="text-amber-500" /> Key Skills or Interests (Optional)
              </label>
              <input 
                type="text" 
                placeholder="e.g. Good at typing, Tally, Teaching, Coding, Physical Fitness" 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-fuchsia-500 outline-none transition"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !education.trim()}
              className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-lg hover:scale-[1.01]"
            >
              {loading ? (
                <span className="flex items-center gap-2 animate-pulse"><Sparkles size={20} /> Analyzing Profile...</span>
              ) : (
                <><Sparkles size={20} /> Find My Career Path</>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 mb-8 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl flex items-center gap-3 border border-red-200 dark:border-red-800/50">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Top Career Recommendations</h2>
            
            {results.map((rec, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-md border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-fuchsia-500 to-indigo-500"></div>
                
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{rec.title}</h3>
                <p className="text-fuchsia-600 dark:text-fuchsia-400 font-bold text-sm mb-4 flex items-center gap-2">
                  <Building2 size={16} /> {rec.department}
                </p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Why you are eligible:</p>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">{rec.eligibility}</p>
                  </div>
                  
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1 flex items-center gap-1"><BookOpen size={14}/> Preparation Tip:</p>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">{rec.preparationTip}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8 flex justify-center">
              <Link href="/mock-tests" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Start preparing with Free Mock Tests →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
