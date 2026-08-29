import Link from "next/link";
import { Compass, Calendar, Mic, Calculator, FileText, Keyboard, Briefcase, Award } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "AI Career Advisor", href: "/tools/career-advisor", icon: Compass, color: "text-fuchsia-500" },
    { name: "AI Study Planner", href: "/tools/study-planner", icon: Calendar, color: "text-cyan-500" },
    { name: "AI Interview Coach", href: "/tools/interview-prep", icon: Mic, color: "text-amber-500" },
    { name: "SEBA/AHSEC Marks Calculator", href: "/tools/marks-calculator", icon: Calculator, color: "text-slate-600 dark:text-slate-400" },
    { name: "Standard Form Generator", href: "/tools/standard-form", icon: FileText, color: "text-slate-600 dark:text-slate-400" },
    { name: "Typing Speed Tester", href: "/tools/typing-test", icon: Keyboard, color: "text-slate-600 dark:text-slate-400" },
    { name: "Tender Contractor Toolkit", href: "/tools/tender-calculator", icon: Briefcase, color: "text-slate-600 dark:text-slate-400" },
    { name: "CGPA to Percentage Calculator", href: "/tools/cgpa-calculator", icon: Award, color: "text-slate-600 dark:text-slate-400" }
  ];

  return (
    <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-10 pb-24 md:pb-10 px-4 md:px-0 z-10 relative print:hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="col-span-1 lg:col-span-1">
          <Link href="/" className="font-bold text-xl tracking-tight text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-4">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">AJ</span>
            AssamJobs
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            The #1 platform for Assam Govt Jobs, Private Jobs, Tenders, and Free AI-powered Career Tools.
          </p>
          <p className="text-xs font-semibold text-slate-400">© 2026 AssamJobs Hub. All rights reserved.</p>
        </div>

        {/* Quick Links (Tools) */}
        <div className="col-span-1 lg:col-span-2">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider text-sm">Free AI Tools & Calculators</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className="flex items-center gap-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -ml-2 rounded-lg transition-colors text-slate-700 dark:text-slate-300">
                <link.icon size={16} className={link.color} />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="col-span-1 lg:col-span-1">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider text-sm">Navigation</h3>
          <ul className="space-y-3">
            <li><Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Latest Jobs</Link></li>
            <li><Link href="/admit-cards" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Admit Cards</Link></li>
            <li><Link href="/results" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Exam Results</Link></li>
            <li><Link href="/tenders" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Assam Tenders</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
