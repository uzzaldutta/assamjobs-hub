with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the messy desktop nav with a streamlined one
old_nav = """              <Link href="/mock-tests" className="text-sm font-semibold hover:text-indigo-600 transition">Mock Test</Link>
              <Link href="/study-materials" className="text-sm font-semibold hover:text-indigo-600 transition">Study Materials</Link>
              <Link href="/previous-papers" className="text-sm font-semibold hover:text-indigo-600 transition">Question Papers</Link>
              <Link href="/tools" className="text-sm font-semibold hover:text-indigo-600 transition">Tools</Link>"""

new_nav = """              <div className="relative group">
                <button className="text-sm font-semibold hover:text-indigo-600 transition flex items-center gap-1">
                  Study Hub <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col py-2">
                  <Link href="/study-materials" className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">📖 Study Books</Link>
                  <Link href="/previous-papers" className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">📄 Previous Papers</Link>
                  <Link href="/syllabus" className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">📋 Syllabus</Link>
                  <Link href="/mock-tests" className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">🎯 AI Mock Tests</Link>
                </div>
              </div>
              <Link href="/tools" className="text-sm font-semibold hover:text-indigo-600 transition">Tools</Link>"""

if old_nav in content:
    content = content.replace(old_nav, new_nav)
    print("Desktop nav updated")
else:
    print("Desktop nav not found")

# Same for mobile nav
old_mobile = """                <Link href="/mock-tests" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">Mock Test</Link>
                <Link href="/study-materials" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">Study Materials</Link>
                <Link href="/previous-papers" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">Question Papers</Link>
                <Link href="/tools" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">Tools</Link>"""

new_mobile = """                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 mt-2">
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Study Hub</p>
                  <Link href="/study-materials" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg mb-1">📖 Study Books</Link>
                  <Link href="/previous-papers" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg mb-1">📄 Previous Papers</Link>
                  <Link href="/syllabus" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg mb-1">📋 Syllabus</Link>
                  <Link href="/mock-tests" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">🎯 AI Mock Tests</Link>
                </div>
                <Link href="/tools" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">Tools</Link>"""

if old_mobile in content:
    content = content.replace(old_mobile, new_mobile)
    print("Mobile nav updated")
else:
    print("Mobile nav not found")

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

