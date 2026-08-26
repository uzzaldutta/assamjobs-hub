"use client";

import { useState, useRef } from "react";
import JobCard from "@/components/JobCard";
import { Sparkles, Loader2, ArrowRight, Upload, FileText } from "lucide-react";

interface MatchResult {
  score: number;
  reason: string;
  job: any;
}

export default function AIMatchPage() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [error, setError] = useState("");
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.text) {
        setResumeText(data.text);
      } else {
        alert("Could not extract text from this PDF.");
      }
    } catch (err) {
      console.error(err);
      alert("Error parsing PDF.");
    } finally {
      setUploadingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleMatch = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume or upload a PDF first!");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/ai-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: resumeText })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze profile");
      
      setResults(data.matches);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh] px-4 md:px-0 max-w-5xl mx-auto w-full">
      <div className="text-center mt-8 mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-4">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">AI Job Matcher</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Paste your resume, skills, or education below. Our Gemini 3.6 AI will analyze your profile and instantly find the perfect jobs for you from our live database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="text-indigo-600 dark:text-indigo-400" />
              Your Qualifications & Experience
            </h2>
            
            <div>
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition border border-indigo-200 dark:border-indigo-800 disabled:opacity-50"
              >
                <Upload size={16} />
                {uploadingPdf ? "Parsing PDF..." : "Upload PDF Resume"}
              </button>
            </div>
          </div>
          
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Type your qualifications, experience, skills, or paste your resume here..."
            className="w-full h-48 p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none mb-4"
          />
          <button 
            onClick={handleMatch}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /> Analyzing Profile...</>
            ) : (
              <><Sparkles size={20} /> Find My Perfect Jobs</>
            )}
          </button>
          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </div>

        {/* Results Section */}
        <div className="flex flex-col gap-4">
          {!results && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/20">
              <Sparkles size={40} className="text-slate-300 dark:text-slate-700 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Your personalized matches will appear here</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/20">
              <Loader2 size={40} className="text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Gemini 3.6 is reading your resume...</p>
            </div>
          )}

          {results && (
            <div className="mb-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" /> 
                Your Top Matches
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Based on your resume and skills</p>
            </div>
          )}

          {results && results.map((match, idx) => (
            <div key={idx} className="relative">
              {/* Match Score Badge */}
              <div className="absolute -top-3 -right-3 z-20 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 flex items-center gap-1">
                {match.score}% Match
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900 overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-indigo-50 dark:border-indigo-900/30">
                  <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                    <strong className="text-indigo-600 dark:text-indigo-400">Why it fits you: </strong>
                    {match.reason}
                  </p>
                </div>
                <div className="p-4">
                  <JobCard job={match.job} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
