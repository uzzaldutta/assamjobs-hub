code = """
"use client";

import { useState } from "react";
import { Plus, Target, Wand2, Settings2, ShieldCheck } from "lucide-react";

export default function MockBuilderClient() {
  const [mode, setMode] = useState<"MANUAL" | "AUTO">("AUTO");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Mock Test Builder 2.0</h1>
        <p className="text-slate-500 mt-1">Create high-quality competitive exams manually or via auto-generation.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setMode("AUTO")}
          className={`flex-1 p-6 rounded-2xl border-2 text-left transition-colors ${mode === 'AUTO' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'}`}
        >
          <Wand2 size={24} className={mode === 'AUTO' ? "text-indigo-600 mb-3" : "text-slate-400 mb-3"} />
          <h3 className={`font-black text-lg ${mode === 'AUTO' ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'}`}>Auto Generation</h3>
          <p className="text-sm text-slate-500 mt-1">Specify syllabus distribution and difficulty constraints. System generates a draft test.</p>
        </button>
        <button 
          onClick={() => setMode("MANUAL")}
          className={`flex-1 p-6 rounded-2xl border-2 text-left transition-colors ${mode === 'MANUAL' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'}`}
        >
          <Settings2 size={24} className={mode === 'MANUAL' ? "text-indigo-600 mb-3" : "text-slate-400 mb-3"} />
          <h3 className={`font-black text-lg ${mode === 'MANUAL' ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'}`}>Manual Mode</h3>
          <p className="text-sm text-slate-500 mt-1">Hand-pick specific questions from the bank to construct a highly targeted exam.</p>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {mode === "AUTO" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Test Title</label>
                <input type="text" placeholder="e.g. ADRE Full Mock Test 1" className="w-full p-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Exam</label>
                <select className="w-full p-2 border border-slate-200 rounded-lg text-slate-700 bg-slate-50">
                  <option>Select Exam...</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Syllabus Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <select className="flex-1 p-2 border border-slate-200 rounded-lg text-sm bg-slate-50"><option>Mathematics</option></select>
                  <input type="number" placeholder="Qty" defaultValue={25} className="w-24 p-2 border border-slate-200 rounded-lg text-sm text-center" />
                </div>
                <div className="flex items-center gap-4">
                  <select className="flex-1 p-2 border border-slate-200 rounded-lg text-sm bg-slate-50"><option>Reasoning</option></select>
                  <input type="number" placeholder="Qty" defaultValue={25} className="w-24 p-2 border border-slate-200 rounded-lg text-sm text-center" />
                </div>
                <button className="text-indigo-600 font-bold text-sm flex items-center gap-1"><Plus size={14}/> Add Subject</button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Difficulty Distribution</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-emerald-600 uppercase mb-2">Easy %</label>
                  <input type="number" defaultValue={20} className="w-full p-2 border border-emerald-200 bg-emerald-50 rounded-lg text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-amber-600 uppercase mb-2">Medium %</label>
                  <input type="number" defaultValue={60} className="w-full p-2 border border-amber-200 bg-amber-50 rounded-lg text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-red-600 uppercase mb-2">Hard %</label>
                  <input type="number" defaultValue={20} className="w-full p-2 border border-red-200 bg-red-50 rounded-lg text-sm" />
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm flex items-center gap-2 transition">
                <Wand2 size={16} /> Generate Draft Test
              </button>
            </div>
            <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-xs text-slate-500 font-medium">
              <ShieldCheck size={16} className="text-slate-400 shrink-0" />
              <span>Auto-generated tests are always saved as DRAFT. You must manually review and approve the generated question set before publishing it to students.</span>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Settings2 size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="font-bold text-lg text-slate-700">Manual Mode Active</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm mt-2 mb-6">Search the question bank and manually append questions to your new mock test.</p>
            <button className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg text-sm">Open Question Selector</button>
          </div>
        )}
      </div>
    </div>
  );
}
"""

wrapper = """
import MockBuilderClient from "./MockBuilderClient";

export default function MockTestBuilderPage() {
  return <MockBuilderClient />;
}
"""

with open("src/app/admin/studio/mock-tests/MockBuilderClient.tsx", "w", encoding="utf-8") as f:
    f.write(code)

with open("src/app/admin/studio/mock-tests/page.tsx", "w", encoding="utf-8") as f:
    f.write(wrapper)
