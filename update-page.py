with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update grid classes
old_grid = 'className="grid grid-cols-4 lg:grid-cols-8 gap-3"'
new_grid = 'className="grid grid-cols-4 md:grid-cols-5 gap-3"'
content = content.replace(old_grid, new_grid)

# 2. Add the two new icons before Railway
old_railway = """                {/* Railway */}
                <Link href="/railway-jobs" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-center group active:scale-95">"""

new_links = """                {/* Study Materials */}
                <Link href="/study-materials" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-red-300 transition-all text-center group active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm leading-tight">Study Books</h3>
                </Link>

                {/* Question Papers */}
                <Link href="/previous-papers" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-teal-300 transition-all text-center group active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 12v6"/><path d="M9 15h6"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm leading-tight">Prev Papers</h3>
                </Link>

                {/* Railway */}
                <Link href="/railway-jobs" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-center group active:scale-95">"""

content = content.replace(old_railway, new_links)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated page.tsx")
