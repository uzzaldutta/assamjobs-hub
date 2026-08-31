with open('src/app/calendar/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r'className=\{`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap \$\{filter === \nf \? \'bg-blue-600 text-white shadow-md\' : \'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border \nborder-slate-200 dark:border-slate-700\'\}`\}'

# The regex didn't match perfectly last time because of powershell wrapping. Let's just use string replace.
