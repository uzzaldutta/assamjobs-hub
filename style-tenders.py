with open('src/components/FeedList.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r'(\{\s*filter === "TENDER"\s*\?\s*"bg-orange-500 text-white shadow-md"\s*:\s*"bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"\s*\})'

replacement = r'{ filter === "TENDER" ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg ring-4 ring-orange-500/30 scale-105 border-transparent" : "bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-md hover:scale-105 border-transparent" }'

content = re.sub(pattern, replacement, content)

with open('src/components/FeedList.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated FeedList Tenders tab styling")
