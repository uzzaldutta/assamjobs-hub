"use client";

import { useState } from "react";
import { Sparkles, Loader2, ArrowLeft, Copy, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

export default function CoverLetterGenerator() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const jobId = params.id as string;
  const jobTitle = searchParams.get("title") || "the position";
  const jobOrg = searchParams.get("org") || "your organization";

  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: name, userSkills: skills, jobTitle, jobOrg })
      });
      const data = await res.json();
      if (data.coverLetter) {
        setResult(data.coverLetter);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-24">
      <Link href={`/jobs/${jobId}`} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition">
        <ArrowLeft size={16} /> Back to Job
      </Link>

      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Sparkles size={24} className="text-indigo-200" />
          AI Cover Letter Generator
        </h1>
        <p className="text-indigo-100">
          Generating a personalized cover letter for <strong>{jobTitle}</strong> at <strong>{jobOrg}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Skills & Experience</label>
            <textarea 
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g. 3 years experience in data entry, typing speed 60WPM, proficient in MS Office..."
              className="w-full min-h-[150px] p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading || !skills}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 shadow-md transition"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? "Writing your letter..." : "Generate Cover Letter"}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center -z-10">
            {!result && <p className="text-slate-400 font-medium">Your generated letter will appear here</p>}
          </div>
          
          {result && (
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-bold text-slate-700 dark:text-slate-200">Result</span>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition"
                >
                  {copied ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16} /> Copy Text</>}
                </button>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none flex-1 overflow-y-auto whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
