with open('src/components/DesktopNav.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_study = """      {/* Study Materials */}
      <Link href="/study-materials" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
        <BookOpen size={16} /> {t("nav_study")}
      </Link>"""

new_prep = """      {/* Preparation Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">
          <BookOpen size={16} /> Preparation <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
        </button>
        <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 translate-y-2 group-hover:translate-y-0">
          <Link href="/study-materials" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">📖 {t("nav_study")}</Link>
          <Link href="/previous-papers" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">📄 Previous Papers</Link>
          <Link href="/mock-tests" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">🎯 {t("nav_mock")}</Link>
          <Link href="/syllabus" className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">📋 {t("nav_syllabus")}</Link>
        </div>
      </div>"""

content = content.replace(old_study, new_prep)

with open('src/components/DesktopNav.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated DesktopNav")
