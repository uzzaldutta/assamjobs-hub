
import Link from "next/link";
import { BookOpen, Target, FileQuestion, UploadCloud, FileText, AlertCircle, BarChart3, LayoutDashboard } from "lucide-react";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/admin/studio" className="font-black text-indigo-600 dark:text-indigo-400 text-lg">
            Content Studio
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin/studio" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          
          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Question Bank</p>
          </div>
          <Link href="/admin/studio/questions" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition">
            <FileQuestion size={18} /> All Questions
          </Link>
          <Link href="/admin/studio/questions/import" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition">
            <UploadCloud size={18} /> Bulk Import
          </Link>

          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Content</p>
          </div>
          <Link href="/admin/studio/materials" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition">
            <BookOpen size={18} /> Study Materials
          </Link>
          <Link href="/admin/studio/mock-tests" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition">
            <Target size={18} /> Mock Builder 2.0
          </Link>

          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Quality Control</p>
          </div>
          <Link href="/admin/studio/review" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition">
            <AlertCircle size={18} /> Review & Gaps
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="font-bold text-slate-800 dark:text-white md:hidden">Studio</div>
          <div className="flex-1"></div>
          <Link href="/admin" className="text-sm font-medium text-slate-500 hover:text-indigo-600">
            Exit Studio
          </Link>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
