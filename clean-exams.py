with open('src/components/DesktopNav.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_exams = """      {/* Exams Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
          <GraduationCap size={16} /> {t("nav_exams")} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
        </button>
        <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 translate-y-2 group-hover:translate-y-0">
          <Link href="/admit-cards" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_admit")}</Link>
          <Link href="/syllabus" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_syllabus")}</Link>
          <Link href="/mock-tests" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_mock")}</Link>
        </div>
      </div>"""

new_exams = """      {/* Exams Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
          <GraduationCap size={16} /> {t("nav_exams")} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
        </button>
        <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 translate-y-2 group-hover:translate-y-0">
          <Link href="/admit-cards" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_admit")}</Link>
          <Link href="/results" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{t("nav_results")}</Link>
        </div>
      </div>"""

# Remove the standalone results link since it's now in Exams
old_results = """      {/* Results */}
      <Link href="/results" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg> {t("nav_results")}
      </Link>"""

content = content.replace(old_exams, new_exams)
content = content.replace(old_results, "")

with open('src/components/DesktopNav.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up Exams Dropdown")
