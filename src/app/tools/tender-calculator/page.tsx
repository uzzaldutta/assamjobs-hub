"use client";

import { useState } from "react";
import { Calculator, Briefcase, TrendingUp, ShieldCheck, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function TenderCalculator() {
  const [activeTab, setActiveTab] = useState("BID"); // BID, EMD, TURNOVER

  // --- BID CALCULATOR STATE ---
  const [estCost, setEstCost] = useState("");
  const [bidType, setBidType] = useState("BELOW"); // BELOW, ABOVE, AT_PAR
  const [bidPercent, setBidPercent] = useState("");

  // --- EMD CALCULATOR STATE ---
  const [emdCost, setEmdCost] = useState("");
  const [contractorCategory, setContractorCategory] = useState("GENERAL"); // GENERAL, SC_ST_OBC

  // --- TURNOVER CALCULATOR STATE ---
  const [turnoverCost, setTurnoverCost] = useState("");
  const [reqPercent, setReqPercent] = useState("30");
  const [y1, setY1] = useState("");
  const [y2, setY2] = useState("");
  const [y3, setY3] = useState("");

  // FORMAT CURRENCY
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/tenders" className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-1">
            &larr; Back to Tenders
          </Link>
          <Link href="/tools" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 text-sm">
            All Tools
          </Link>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-90 relative z-10" />
            <h1 className="text-3xl font-bold mb-2 relative z-10">Contractor Toolkit</h1>
            <p className="text-amber-100 max-w-md mx-auto relative z-10">Essential financial calculators for Assam Govt Tenders & Contracts.</p>
          </div>

          <div className="p-4 sm:p-8">
            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl mb-8 scrollbar-hide">
              <button 
                onClick={() => setActiveTab("BID")}
                className={`flex-1 min-w-[120px] py-3 text-sm font-bold rounded-lg transition flex items-center justify-center gap-2 ${activeTab === "BID" ? "bg-white dark:bg-slate-700 shadow-sm text-amber-600 dark:text-amber-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                <Calculator size={16} /> Bid %
              </button>
              <button 
                onClick={() => setActiveTab("EMD")}
                className={`flex-1 min-w-[120px] py-3 text-sm font-bold rounded-lg transition flex items-center justify-center gap-2 ${activeTab === "EMD" ? "bg-white dark:bg-slate-700 shadow-sm text-amber-600 dark:text-amber-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                <ShieldCheck size={16} /> EMD
              </button>
              <button 
                onClick={() => setActiveTab("TURNOVER")}
                className={`flex-1 min-w-[120px] py-3 text-sm font-bold rounded-lg transition flex items-center justify-center gap-2 ${activeTab === "TURNOVER" ? "bg-white dark:bg-slate-700 shadow-sm text-amber-600 dark:text-amber-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                <TrendingUp size={16} /> Turnover
              </button>
            </div>

            {/* BID CALCULATOR */}
            {activeTab === "BID" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Calculate Bid Value (Below / Above)</h3>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Estimated Project Cost (₹)</label>
                    <input 
                      type="number" 
                      value={estCost}
                      onChange={(e) => setEstCost(e.target.value)}
                      placeholder="e.g. 5000000"
                      className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Bid Type</label>
                      <select 
                        value={bidType}
                        onChange={(e) => setBidType(e.target.value)}
                        className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="BELOW">Below (%)</option>
                        <option value="ABOVE">Above (%)</option>
                        <option value="AT_PAR">At Par (0%)</option>
                      </select>
                    </div>
                    {bidType !== "AT_PAR" && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Percentage (%)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={bidPercent}
                          onChange={(e) => setBidPercent(e.target.value)}
                          placeholder="e.g. 14.99"
                          className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {estCost && (bidType === "AT_PAR" || bidPercent) && (
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 text-center">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Your Final Bid Amount</p>
                    <div className="text-4xl font-black text-amber-600 dark:text-amber-400 mb-2">
                      {formatINR(
                        bidType === "AT_PAR" ? parseFloat(estCost) :
                        bidType === "BELOW" ? parseFloat(estCost) - (parseFloat(estCost) * (parseFloat(bidPercent)/100)) :
                        parseFloat(estCost) + (parseFloat(estCost) * (parseFloat(bidPercent)/100))
                      )}
                    </div>
                    {bidType !== "AT_PAR" && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Difference: <span className="font-bold">{formatINR(parseFloat(estCost) * (parseFloat(bidPercent)/100))}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* EMD CALCULATOR */}
            {activeTab === "EMD" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Earnest Money Deposit (EMD) Calculator</h3>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Estimated Project Cost (₹)</label>
                    <input 
                      type="number" 
                      value={emdCost}
                      onChange={(e) => setEmdCost(e.target.value)}
                      placeholder="e.g. 5000000"
                      className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contractor Category</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setContractorCategory("GENERAL")}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all ${contractorCategory === "GENERAL" ? "bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/30 dark:border-amber-500 dark:text-amber-400 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"}`}
                      >
                        General (2%)
                      </button>
                      <button
                        onClick={() => setContractorCategory("SC_ST_OBC")}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all ${contractorCategory === "SC_ST_OBC" ? "bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/30 dark:border-amber-500 dark:text-amber-400 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"}`}
                      >
                        SC / ST / OBC (1%)
                      </button>
                    </div>
                  </div>
                </div>

                {emdCost && (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Required EMD Amount</p>
                    <div className="text-4xl font-black text-slate-800 dark:text-white mb-2">
                      {formatINR(parseFloat(emdCost) * (contractorCategory === "GENERAL" ? 0.02 : 0.01))}
                    </div>
                    <p className="text-xs text-slate-500">Prepare FD / Demand Draft for this exact amount.</p>
                  </div>
                )}
              </div>
            )}

            {/* TURNOVER CALCULATOR */}
            {activeTab === "TURNOVER" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Financial Turnover Eligibility</h3>
                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Estimated Cost (₹)</label>
                      <input 
                        type="number" 
                        value={turnoverCost}
                        onChange={(e) => setTurnoverCost(e.target.value)}
                        className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Required % (Usually 30%)</label>
                      <input 
                        type="number" 
                        value={reqPercent}
                        onChange={(e) => setReqPercent(e.target.value)}
                        className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Your Turnover (Last 3 Years)</label>
                    <div className="space-y-3">
                      <input type="number" value={y1} onChange={(e) => setY1(e.target.value)} placeholder="Year 1 (₹)" className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500" />
                      <input type="number" value={y2} onChange={(e) => setY2(e.target.value)} placeholder="Year 2 (₹)" className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500" />
                      <input type="number" value={y3} onChange={(e) => setY3(e.target.value)} placeholder="Year 3 (₹)" className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500" />
                    </div>
                  </div>
                </div>

                {turnoverCost && reqPercent && y1 && y2 && y3 && (
                  <div className={`p-6 rounded-2xl border text-center ${
                    ((parseFloat(y1) + parseFloat(y2) + parseFloat(y3)) / 3) >= (parseFloat(turnoverCost) * (parseFloat(reqPercent)/100)) 
                    ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' 
                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Average Annual Turnover</p>
                    <div className="text-3xl font-black mb-2 text-slate-800 dark:text-white">
                      {formatINR((parseFloat(y1) + parseFloat(y2) + parseFloat(y3)) / 3)}
                    </div>
                    
                    <p className="text-sm font-medium mb-4">
                      Required Turnover: {formatINR(parseFloat(turnoverCost) * (parseFloat(reqPercent)/100))}
                    </p>

                    {((parseFloat(y1) + parseFloat(y2) + parseFloat(y3)) / 3) >= (parseFloat(turnoverCost) * (parseFloat(reqPercent)/100)) ? (
                      <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        <ShieldCheck size={18} /> You are Eligible
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        <RotateCcw size={18} /> Not Eligible (Turnover Too Low)
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
