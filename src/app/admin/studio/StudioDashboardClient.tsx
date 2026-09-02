
"use client";

import Link from "next/link";
import { 
  Database, FileText, CheckCircle, AlertTriangle, 
  Settings, Zap, ShieldAlert, BarChart2, Plus, 
  UploadCloud, BookOpen
} from "lucide-react";

export default function StudioDashboardClient({ stats }: { stats: any }) {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Content Studio</h1>
          <p className="text-slate-500 mt-1">Manage all competitive exam content and materials.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/studio/generator" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-sm shadow-indigo-600/20">
            <Zap size={16} /> AI Generator
          </Link>
          <Link href="/admin/studio/questions/new" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-sm shadow-slate-900/20">
            <Plus size={16} /> New Question
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Questions" value={stats.totalQuestions} icon={<Database size={20} className="text-indigo-500" />} />
        <StatCard title="Questions Today" value={stats.questionsAddedToday} icon={<Zap size={20} className="text-emerald-500" />} />
        <StatCard title="Published Materials" value={stats.publishedMaterials} subtitle={`/ ${stats.totalMaterials} total`} icon={<BookOpen size={20} className="text-blue-500" />} />
        <StatCard title="Missing Explanations" value={stats.missingExplanations} icon={<AlertTriangle size={20} className="text-amber-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BarChart2 size={18} className="text-slate-400" /> Question Workflow</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-600">DRAFT</span>
              <span className="font-black text-slate-900">{stats.draftQuestions}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-amber-50 border border-amber-100">
              <span className="font-bold text-amber-700">REVIEW</span>
              <span className="font-black text-amber-900">{stats.reviewQuestions}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-50 border border-indigo-100">
              <span className="font-bold text-indigo-700">APPROVED</span>
              <span className="font-black text-indigo-900">{stats.approvedQuestions}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <span className="font-bold text-emerald-700">PUBLISHED</span>
              <span className="font-black text-emerald-900">{stats.publishedQuestions}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Settings size={18} className="text-slate-400" /> Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <ActionCard href="/admin/studio/questions" title="Question Bank" desc="Manage all questions" icon={<Database size={24} className="text-indigo-600"/>} />
            <ActionCard href="/admin/studio/materials" title="Materials" desc="Manage PDFs & Books" icon={<BookOpen size={24} className="text-blue-600"/>} />
            <ActionCard href="/admin/studio/generator" title="AI Factory" desc="Generate from PDF" icon={<Zap size={24} className="text-amber-500"/>} />
            <ActionCard href="/admin/studio/materials/new" title="Upload Material" desc="Add new PDF" icon={<UploadCloud size={24} className="text-emerald-600"/>} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-black text-slate-900">{value}</span>
        {subtitle && <span className="text-sm font-bold text-slate-400 mb-1">{subtitle}</span>}
      </div>
    </div>
  );
}

function ActionCard({ href, title, desc, icon }: any) {
  return (
    <Link href={href} className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition group flex flex-col gap-3">
      <div className="p-2 bg-slate-100 group-hover:bg-white rounded-lg w-fit transition">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
    </Link>
  );
}
