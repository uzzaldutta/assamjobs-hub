import React from 'react';
import Link from 'next/link';
import { Home, Building2, GraduationCap, FileText, CheckSquare, Receipt, IdCard, BookOpen, FileArchive, Train } from 'lucide-react';

const categories = [
  { name: 'Govt Jobs', icon: Home, href: '/govt-jobs', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', hover: 'group-hover:border-blue-200' },
  { name: 'Private Jobs', icon: Building2, href: '/private-jobs', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', hover: 'group-hover:border-purple-200' },
  { name: 'Admissions', icon: GraduationCap, href: '/admissions', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', hover: 'group-hover:border-emerald-200' },
  { name: 'Exams', icon: FileText, href: '/exams', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20', hover: 'group-hover:border-fuchsia-200' },
  { name: 'Mock Test', icon: CheckSquare, href: '/mock-tests', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', hover: 'group-hover:border-orange-200' },
  { name: 'Tenders', icon: Receipt, href: '/tenders', color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20', hover: 'group-hover:border-pink-200' },
  { name: 'Admits', icon: IdCard, href: '/admit-cards', color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20', hover: 'group-hover:border-cyan-200' },
  { name: 'Study Books', icon: BookOpen, href: '/study-materials', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', hover: 'group-hover:border-red-200' },
  { name: 'Prev Papers', icon: FileArchive, href: '/previous-papers', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20', hover: 'group-hover:border-teal-200' },
  { name: 'Railway', icon: Train, href: '/railway-jobs', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', hover: 'group-hover:border-amber-200' }
];

export default function CategoryGrid() {
  return (
    <section className="py-6 sm:py-8 px-2 sm:px-4 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-2 sm:gap-4">
        {categories.map((cat, idx) => (
          <Link 
            key={idx} 
            href={cat.href}
            className={`flex flex-col items-center justify-center p-2 sm:p-6 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-md transition-all group ${cat.hover}`}
          >
            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-2 sm:mb-4 transition-transform group-hover:scale-110 ${cat.bg} ${cat.color}`}>
              <cat.icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-[10px] sm:text-sm text-center leading-tight whitespace-normal">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
