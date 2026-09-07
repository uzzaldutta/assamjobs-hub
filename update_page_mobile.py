import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Govt mobile
content = content.replace(
    'className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl w-full justify-center"',
    'className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md text-emerald-600 dark:text-emerald-400 font-bold rounded-xl w-full justify-center hover:bg-emerald-500/20 transition-all shadow-sm"'
)

# Private mobile
content = content.replace(
    'className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold rounded-xl w-full justify-center"',
    'className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 border border-blue-500/20 backdrop-blur-md text-blue-600 dark:text-blue-400 font-bold rounded-xl w-full justify-center hover:bg-blue-500/20 transition-all shadow-sm"'
)

# Closing soon mobile
content = content.replace(
    'className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold rounded-xl w-full justify-center"',
    'className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/20 backdrop-blur-md text-amber-600 dark:text-amber-400 font-bold rounded-xl w-full justify-center hover:bg-amber-500/20 transition-all shadow-sm"'
)

# Updates mobile
content = content.replace(
    'className="inline-flex items-center gap-2 px-6 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-bold rounded-xl w-full justify-center"',
    'className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 border border-purple-500/20 backdrop-blur-md text-purple-600 dark:text-purple-400 font-bold rounded-xl w-full justify-center hover:bg-purple-500/20 transition-all shadow-sm"'
)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
