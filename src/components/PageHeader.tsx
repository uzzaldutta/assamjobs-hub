import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  theme: "blue" | "green" | "purple" | "orange";
  showSearch?: boolean;
  onSearch?: (value: string) => void;
}

export default function PageHeader({ title, subtitle, theme, showSearch, onSearch }: PageHeaderProps) {
  
  // Theme dictionaries
  const themes = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800/50"
    },
    green: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800/50"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-700 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800/50"
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-700 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800/50"
    }
  };

  const selectedTheme = themes[theme];

  return (
    <div className={`w-full ${selectedTheme.bg} border-b ${selectedTheme.border} px-4 py-8 relative overflow-hidden`}>
      
      {/* Decorative Blur */}
      <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl opacity-50 pointer-events-none ${theme === 'blue' ? 'bg-blue-300' : theme === 'green' ? 'bg-emerald-300' : theme === 'purple' ? 'bg-purple-300' : 'bg-orange-300'} dark:opacity-10 rounded-full`}></div>

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="flex items-start gap-4">
          <Link href="/" className="mt-1 p-2 bg-white/50 dark:bg-slate-800/50 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors backdrop-blur-sm shrink-0">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </Link>
          <div>
            <h1 className={`text-2xl md:text-3xl font-black ${selectedTheme.text} uppercase tracking-tight`}>
              {title}
            </h1>
            {subtitle && <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mt-1">{subtitle}</p>}
          </div>
        </div>

        {showSearch && (
          <div className="relative w-full md:w-80 group">
            <input 
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
}
