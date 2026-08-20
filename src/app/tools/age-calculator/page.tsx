"use client";

import { useState } from "react";
import { Calculator, Calendar } from "lucide-react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [asOnDate, setAsOnDate] = useState("");
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateAge = () => {
    if (!dob || !asOnDate) return;
    
    const birthDate = new Date(dob);
    const targetDate = new Date(asOnDate);
    
    if (birthDate > targetDate) {
      alert("Date of Birth cannot be after the As On Date.");
      return;
    }

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const previousMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += previousMonth.getDate();
    }
    
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setResult({ years, months, days });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
            <Calculator className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Age Calculator</h1>
            <p className="text-sm text-slate-500">Calculate exact age for Govt job applications</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Date of Birth</label>
            <input 
              type="date" 
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Age As On Date</label>
            <input 
              type="date" 
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
            <p className="text-xs text-slate-400 mt-1">Check the official notification for the required cut-off date (e.g. 01/01/2024)</p>
          </div>

          <button 
            onClick={calculateAge}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md"
          >
            Calculate Age
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center animate-in fade-in slide-in-from-bottom-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">Your exact age is:</p>
            <div className="flex justify-center gap-4 text-indigo-600 dark:text-indigo-400 font-black">
              <div className="flex flex-col items-center">
                <span className="text-4xl">{result.years}</span>
                <span className="text-xs uppercase tracking-wider text-slate-500">Years</span>
              </div>
              <span className="text-4xl font-light text-slate-300">:</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl">{result.months}</span>
                <span className="text-xs uppercase tracking-wider text-slate-500">Months</span>
              </div>
              <span className="text-4xl font-light text-slate-300">:</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl">{result.days}</span>
                <span className="text-xs uppercase tracking-wider text-slate-500">Days</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
