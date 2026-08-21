"use client";

import { useState } from "react";
import { IndianRupee, Calculator, CheckCircle2 } from "lucide-react";

export default function SalaryCalculator() {
  const [payBand, setPayBand] = useState<number>(14000);
  const [gradePay, setGradePay] = useState<number>(6200);
  const [daPercent, setDaPercent] = useState<number>(50); // Standard DA as of 2024 is around 50%
  const [hraPercent, setHraPercent] = useState<number>(8); // Varies by district, typical 8-10%
  const [ma, setMa] = useState<number>(600); // Medical Allowance standard 600

  // Calculations
  const basicPay = payBand + gradePay;
  const daAmount = Math.round(basicPay * (daPercent / 100));
  const hraAmount = Math.round(basicPay * (hraPercent / 100));
  const grossSalary = basicPay + daAmount + hraAmount + ma;
  
  // Deductions
  const npsDeduction = Math.round((basicPay + daAmount) * 0.10); // 10% of Basic + DA
  const gisDeduction = 400; // Group Insurance typical
  const ptDeduction = 208; // Professional Tax typical
  
  const totalDeductions = npsDeduction + gisDeduction + ptDeduction;
  const inHandSalary = grossSalary - totalDeductions;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-10">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mb-4">
            <IndianRupee className="text-emerald-600 dark:text-emerald-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Assam Govt Salary Calculator</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">Calculate your exact In-Hand Salary based on Pay Bands and Grade Pay (ROP 2017). Perfect for checking actual earnings before applying to ADRE, APSC, or Police jobs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Inputs */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg border-b border-slate-200 dark:border-slate-700 pb-2">Enter Job Details</h3>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Pay Band Starting Value (₹)</label>
              <input type="number" value={payBand} onChange={e => setPayBand(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-500" />
              <p className="text-xs text-slate-400 mt-1">e.g. For PB-2 (14,000 - 60,500), enter 14000</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Grade Pay (₹)</label>
              <input type="number" value={gradePay} onChange={e => setGradePay(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">DA (%)</label>
                <input type="number" value={daPercent} onChange={e => setDaPercent(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">HRA (%)</label>
                <input type="number" value={hraPercent} onChange={e => setHraPercent(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
              </div>
            </div>
          </div>

          {/* Results Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-emerald-500" /> Salary Breakdown
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Basic Pay (PB + GP)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{basicPay.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Dearness Allowance (DA @ {daPercent}%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{daAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">House Rent Allowance (HRA @ {hraPercent}%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{hraAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Medical Allowance (MA)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{ma.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">Gross Salary</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{grossSalary.toLocaleString('en-IN')}</span>
              </div>

              <div className="mt-6 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-red-500">Deductions</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">NPS (10% of Basic + DA)</span>
                <span className="font-semibold text-red-500">- ₹{npsDeduction.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">GIS & Prof. Tax (Approx)</span>
                <span className="font-semibold text-red-500">- ₹{(gisDeduction + ptDeduction).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-emerald-600 text-white rounded-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <IndianRupee size={64} />
              </div>
              <p className="text-emerald-100 text-sm font-semibold uppercase tracking-wider mb-1">Estimated In-Hand Salary</p>
              <h2 className="text-4xl font-black">₹{inHandSalary.toLocaleString('en-IN')} <span className="text-lg font-medium">/ mo</span></h2>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
