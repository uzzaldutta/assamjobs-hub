with open('src/app/calendar/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}", "className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${f === 'TENDER' ? (filter === 'TENDER' ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg ring-4 ring-orange-500/30 scale-105 border-transparent' : 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-md hover:scale-105 border-transparent') : (filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700')}`}")

with open('src/app/calendar/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Calendar Tenders tab styling")
