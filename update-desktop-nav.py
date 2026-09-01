import re

with open("src/components/DesktopNav.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add a search button right before the "Preparation Dropdown"
search_link = """
      {/* Global Search */}
      <Link href="/search" className="flex items-center gap-1.5 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-xl backdrop-blur-sm border border-transparent transition-colors">
        <Search size={16} /> Search
      </Link>
"""

content = content.replace('{/* Preparation Dropdown */}', search_link + '\n      {/* Preparation Dropdown */}')

with open("src/components/DesktopNav.tsx", "w", encoding="utf-8") as f:
    f.write(content)
