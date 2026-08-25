import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the Mobile Quick Categories
start_marker = '{/* Mobile Quick Categories (Grid Layout) */}'
end_marker = '{/* Main Layout Grid */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_categories = """{/* 4 Large Quick Categories (Unified Desktop & Mobile) */}
      <div className="w-full px-4 md:px-0 pt-6 pb-4 relative z-20 max-w-5xl mx-auto -mt-6 md:mt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Link href="/govt-jobs" className="flex flex-col items-center justify-center p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🏛</span>
            </div>
            <span className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200">Govt Jobs</span>
          </Link>
          
          <Link href="/private-jobs" className="flex flex-col items-center justify-center p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💼</span>
            </div>
            <span className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200">Private Jobs</span>
          </Link>

          <Link href="/admissions" className="flex flex-col items-center justify-center p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all group">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🎓</span>
            </div>
            <span className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200">Admissions</span>
          </Link>

          <Link href="/admit-cards" className="flex flex-col items-center justify-center p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition-all group">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📝</span>
            </div>
            <span className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200">Exams</span>
          </Link>
        </div>
      </div>

      """

content = content[:start_idx] + new_categories + content[end_idx:]

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
