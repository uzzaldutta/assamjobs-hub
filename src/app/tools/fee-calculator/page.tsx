"use client";

import { useState } from "react";
import { Calculator, Wallet, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeeCalculator() {
  const [examType, setExamType] = useState("APSC");
  const [category, setCategory] = useState("GENERAL");
  const [bpl, setBpl] = useState(false);
  const [pwd, setPwd] = useState(false);

  const calculateFee = () => {
    if (pwd || bpl) return 0; // Usually exempt

    switch (examType) {
      case "APSC": // Assam Public Service Commission
        if (category === "GENERAL") return 297.20;
        if (category === "SC" || category === "ST" || category === "OBC") return 197.20;
        return 297.20;
      
      case "SSC": // Staff Selection Commission
        if (category === "SC" || category === "ST") return 0;
        return 100;
        
      case "UPSC":
        if (category === "SC" || category === "ST") return 0;
        return 100;

      case "BANKING": // IBPS/SBI
        if (category === "SC" || category === "ST") return 175;
        return 850;

      case "RAILWAY": // RRB
        if (category === "SC" || category === "ST") return 250;
        return 500;
        
      case "ASSAM_DIRECT": // ADRE
        if (category === "GENERAL" || category === "OBC") return 350;
        if (category === "SC" || category === "ST") return 250;
        return 350;

      default:
        return 0;
    }
  };

  const fee = calculateFee();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <Link href="/tools" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 mb-6">
          &larr; Back to all tools
        </Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
            <Wallet className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl font-bold mb-2">Exam Fee Calculator</h1>
            <p className="text-emerald-100 max-w-sm mx-auto">Instantly check your exact application fee and exemptions for major exams.</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Exam / Board</label>
              <select 
                value={examType} 
                onChange={(e) => setExamType(e.target.value)}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="APSC">APSC (Assam Public Service Commission)</option>
                <option value="ASSAM_DIRECT">Assam Direct Recruitment (ADRE)</option>
                <option value="SSC">SSC (Staff Selection Commission)</option>
                <option value="UPSC">UPSC (Civil Services)</option>
                <option value="BANKING">Banking (IBPS / SBI)</option>
                <option value="RAILWAY">Railway (RRB)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Your Caste Category</label>
              <div className="grid grid-cols-2 gap-3">
                {["GENERAL", "OBC", "SC", "ST"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                      category === cat 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-500 dark:text-emerald-400 shadow-sm" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Special Exemptions</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-xl flex-1 bg-slate-50 dark:bg-slate-800">
                  <input type="checkbox" checked={bpl} onChange={(e) => setBpl(e.target.checked)} className="w-4 h-4 text-emerald-600 rounded" />
                  <span className="text-sm font-medium">BPL Certificate</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-xl flex-1 bg-slate-50 dark:bg-slate-800">
                  <input type="checkbox" checked={pwd} onChange={(e) => setPwd(e.target.checked)} className="w-4 h-4 text-emerald-600 rounded" />
                  <span className="text-sm font-medium">PwD (Divyang)</span>
                </label>
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Total Application Fee</p>
              <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-2">
                ₹{fee.toFixed(2)}
              </div>
              {fee === 0 ? (
                <div className="inline-flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                  <CheckCircle2 size={16} /> Fully Exempted
                </div>
              ) : (
                <p className="text-xs text-slate-400">Excludes bank processing charges</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
