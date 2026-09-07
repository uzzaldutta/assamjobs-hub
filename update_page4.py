import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update query limits
content = re.sub(r"\.limit\(6\)", ".limit(15)", content)
content = re.sub(r"\.limit\(3\)", ".limit(10)", content)
content = content.replace(".slice(0, 10)", ".slice(0, 25)") # max 25 recent items

# 2. Update View All buttons
# Govt Jobs
content = content.replace(
    'className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 text-sm hidden sm:flex"',
    'className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md font-bold text-sm hover:bg-emerald-500/20 hover:scale-105 transition-all flex items-center gap-1 hidden sm:flex shadow-sm"'
)

# Private Jobs
content = content.replace(
    'className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold flex items-center gap-1 text-sm hidden sm:flex"',
    'className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 backdrop-blur-md font-bold text-sm hover:bg-blue-500/20 hover:scale-105 transition-all flex items-center gap-1 hidden sm:flex shadow-sm"'
)

# Closing Soon (if present)
content = content.replace(
    'className="text-amber-700 hover:text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1 text-sm hidden sm:flex"',
    'className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 backdrop-blur-md font-bold text-sm hover:bg-amber-500/20 hover:scale-105 transition-all flex items-center gap-1 hidden sm:flex shadow-sm"'
)

# Updates
content = content.replace(
    'className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1 text-sm hidden sm:flex"',
    'className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 backdrop-blur-md font-bold text-sm hover:bg-purple-500/20 hover:scale-105 transition-all flex items-center gap-1 hidden sm:flex shadow-sm"'
)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated page.tsx limits and glassmorphism buttons.")
