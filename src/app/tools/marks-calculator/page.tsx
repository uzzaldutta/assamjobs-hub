"use client";

import { useState } from "react";
import { Calculator, Award, GraduationCap, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function MarksCalculator() {
  const [board, setBoard] = useState("SEBA"); // SEBA (10th) or AHSEC (12th)
  
  // SEBA usually has 6 subjects (Best of 5 rule applies)
  const [sebaMarks, setSebaMarks] = useState(["", "", "", "", "", ""]);
  
  // AHSEC usually has 5 subjects (No best of 5, just total of 5 subjects)
  const [ahsecMarks, setAhsecMarks] = useState(["", "", "", "", ""]);

  const [result, setResult] = useState<{ total: number; percentage: string; division: string; bestOf5Applied?: boolean } | null>(null);

  const calculateSeba = () => {
    const marks = sebaMarks.map(m => parseInt(m) || 0);
    // SEBA Best of 5 rule: Calculate total of top 5 subjects
    const sortedMarks = [...marks].sort((a, b) => b - a);
    const top5 = sortedMarks.slice(0, 5);
    const total = top5.reduce((sum, val) => sum + val, 0);
    const percentage = (total / 500) * 100;
    
    let division = "Fail";
    if (percentage >= 60) division = "1st Division";
    else if (percentage >= 45) division = "2nd Division";
    else if (percentage >= 30) division = "3rd Division";

    setResult({ total, percentage: percentage.toFixed(2), division, bestOf5Applied: true });
  };

  const calculateAhsec = () => {
    const marks = ahsecMarks.map(m => parseInt(m) || 0);
    const total = marks.reduce((sum, val) => sum + val, 0);
    const percentage = (total / 500) * 100;
    
    let division = "Fail";
    if (percentage >= 60) division = "1st Division";
    else if (percentage >= 45) division = "2nd Division";
    else if (percentage >= 30) division = "3rd Division";

    setResult({ total, percentage: percentage.toFixed(2), division, bestOf5Applied: false });
  };

  const reset = () => {
    setSebaMarks(["", "", "", "", "", ""]);
    setAhsecMarks(["", "", "", "", ""]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/tools" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 mb-6">
          &larr; Back to all tools
        </Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl font-bold mb-2">SEBA / AHSEC Marks Calculator</h1>
            <p className="text-blue-100 max-w-md mx-auto">Calculate your exact percentage, total marks, and division instantly.</p>
          </div>

          <div className="p-8">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8">
              <button 
                onClick={() => { setBoard("SEBA"); setResult(null); }}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition ${board === "SEBA" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                SEBA (Class 10)
              </button>
              <button 
                onClick={() => { setBoard("AHSEC"); setResult(null); }}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition ${board === "AHSEC" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                AHSEC (Class 12)
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">
                Enter your marks (Out of 100)
              </h3>
              
              {board === "SEBA" ? (
                <div className="grid grid-cols-2 gap-4">
                  {sebaMarks.map((mark, i) => (
                    <div key={i}>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Subject {i + 1}</label>
                      <input 
                        type="number" 
                        max="100"
                        min="0"
                        value={mark} 
                        onChange={(e) => {
                          const newMarks = [...sebaMarks];
                          newMarks[i] = e.target.value;
                          setSebaMarks(newMarks);
                        }}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 85"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {ahsecMarks.map((mark, i) => (
                    <div key={i}>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Subject {i + 1}</label>
                      <input 
                        type="number" 
                        max="100"
                        min="0"
                        value={mark} 
                        onChange={(e) => {
                          const newMarks = [...ahsecMarks];
                          newMarks[i] = e.target.value;
                          setAhsecMarks(newMarks);
                        }}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 85"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={board === "SEBA" ? calculateSeba : calculateAhsec}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                Calculate Results <ArrowRight size={18} />
              </button>
              <button 
                onClick={reset}
                className="p-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            {result && (
              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-600 text-white rounded-xl">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Result</h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {result.bestOf5Applied ? "SEBA Best of 5 Rule Applied" : "Standard 500 Total"}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 font-medium mb-1">Total Marks</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">{result.total}<span className="text-sm text-slate-400 font-medium">/500</span></p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 font-medium mb-1">Percentage</p>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{result.percentage}%</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm text-center border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 font-medium mb-1">Division</p>
                    <p className={`text-lg font-black mt-1 ${result.division === "1st Division" ? "text-emerald-500" : result.division === "Fail" ? "text-red-500" : "text-amber-500"}`}>
                      {result.division}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
