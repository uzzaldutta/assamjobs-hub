with open('src/components/DesktopNav.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Revert previous script's effect if any
content = content.replace('px-3 py-2 rounded-xl backdrop-blur-sm border border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors', 'hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors')

# Now precisely replace each one
colors = {
    'Home': ('blue', 'text-blue-600', 'text-blue-400'),
    'Jobs': ('emerald', 'text-emerald-600', 'text-emerald-400'),
    'Exams': ('purple', 'text-purple-600', 'text-purple-400'),
    'Tenders': ('orange', 'text-orange-600', 'text-orange-400'),
    'Tools': ('amber', 'text-amber-600', 'text-amber-400'),
    'Calendar': ('pink', 'text-pink-600', 'text-pink-400'),
}

import re

# Home
content = re.sub(r'className="flex items-center gap-1\.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">\n\s*<Home', r'className="flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-md border border-transparent hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:border-blue-200/50 dark:hover:border-blue-700/50 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm transition-all">\n        <Home', content)

# Jobs
content = re.sub(r'className="flex items-center gap-1\.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">\n\s*<Briefcase', r'className="flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-md border border-transparent hover:bg-emerald-50/80 dark:hover:bg-emerald-900/20 hover:border-emerald-200/50 dark:hover:border-emerald-700/50 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm transition-all">\n        <Briefcase', content)

# Exams
content = re.sub(r'className="flex items-center gap-1\.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">\n\s*<GraduationCap', r'className="flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-md border border-transparent hover:bg-purple-50/80 dark:hover:bg-purple-900/20 hover:border-purple-200/50 dark:hover:border-purple-700/50 hover:text-purple-600 dark:hover:text-purple-400 hover:shadow-sm transition-all">\n        <GraduationCap', content)

# Tenders
content = re.sub(r'className="flex items-center gap-1\.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">\n\s*<FileText', r'className="flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-md border border-transparent hover:bg-orange-50/80 dark:hover:bg-orange-900/20 hover:border-orange-200/50 dark:hover:border-orange-700/50 hover:text-orange-600 dark:hover:text-orange-400 hover:shadow-sm transition-all">\n        <FileText', content)

# Tools
content = re.sub(r'className="flex items-center gap-1\.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">\n\s*<Wrench', r'className="flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-md border border-transparent hover:bg-amber-50/80 dark:hover:bg-amber-900/20 hover:border-amber-200/50 dark:hover:border-amber-700/50 hover:text-amber-600 dark:hover:text-amber-400 hover:shadow-sm transition-all">\n        <Wrench', content)

# Calendar
content = re.sub(r'className="flex items-center gap-1\.5 hover:text-emerald-600 dark:hover:text-emerald-400 py-4 transition-colors">\n\s*<CalendarDays', r'className="flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-md border border-transparent hover:bg-pink-50/80 dark:hover:bg-pink-900/20 hover:border-pink-200/50 dark:hover:border-pink-700/50 hover:text-pink-600 dark:hover:text-pink-400 hover:shadow-sm transition-all">\n        <CalendarDays', content)

# Also fix the general spacing of the nav
content = content.replace('gap-6', 'gap-2 lg:gap-3')

with open('src/components/DesktopNav.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated DesktopNav links with individual colors")
