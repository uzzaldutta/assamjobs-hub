"use client";

import { useState } from "react";
import { GraduationCap, Percent } from "lucide-react";

export default function CGPAConverter() {
  const [university, setUniversity] = useState<string>("GU");
  const [cgpa, setCgpa] = useState<string>("");
  const [percentage, setPercentage] = useState<number | null>(null);

  const calculatePercentage = () => {
    const val = parseFloat(cgpa);
    if (isNaN(val) || val < 0 || val > 10) {
      alert("Please enter a valid CGPA between 0 and 10");
      return;
    }

    let result = 0;
    switch (university) {
      case "GU": // Gauhati University standard multiplier is 10 (as per recent CBCS) or sometimes 9.5 depending on batch. We use 10 for newer CBCS.
        result = val * 10;
        break;
      case "DU": // Dibrugarh University CBCS: Percentage = (CGPA x 10)
        result = val * 10;
        break;
      case "ASTU": // Assam Science and Technology University: Percentage = (CGPA - 0.75) * 10
        result = (val - 0.75) * 10;
        break;
      case "CBSE": // CBSE Class 10/12 standard: CGPA * 9.5
        result = val * 9.5;
        break;
      default:
        result = val * 9.5;
    }

    // Ensure it doesn't exceed 100 or go below 0
    setPercentage(Math.max(0, Math.min(100, result)));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-10">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 bg-amber-100 dark:bg-amber-900/50 rounded-full mb-4">
            <GraduationCap className="text-amber-600 dark:text-amber-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">CGPA to Percentage</h1>
          <p className="text-slate-500 mt-2">Convert your University CGPA to Percentage for job application forms.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Select Board / University</label>
            <select 
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition appearance-none"
            >
              <option value="GU">Gauhati University (CBCS)</option>
              <option value="DU">Dibrugarh University (CBCS)</option>
              <option value="ASTU">ASTU (Assam Science and Technology)</option>
              <option value="CBSE">CBSE (Class 10/12)</option>
              <option value="OTHER">Other (Standard 9.5 multiplier)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Enter your CGPA</label>
            <input 
              type="number" 
              step="0.01"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder="e.g. 8.5"
              className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
            />
          </div>

          <button 
            onClick={calculatePercentage}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-md"
          >
            Calculate Percentage
          </button>
        </div>

        {percentage !== null && (
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center animate-in fade-in slide-in-from-bottom-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">Your equivalent percentage is:</p>
            <div className="flex justify-center items-center gap-1 text-amber-600 dark:text-amber-400 font-black">
              <span className="text-5xl">{percentage.toFixed(2)}</span>
              <Percent size={28} className="mt-2" />
            </div>
            <p className="text-xs text-slate-400 mt-3">
              {university === "ASTU" ? "Formula used: (CGPA - 0.75) × 10" : 
               university === "GU" || university === "DU" ? "Formula used: CGPA × 10 (As per new CBCS guidelines)" : 
               "Formula used: CGPA × 9.5"}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
