with open('src/app/study-materials/[materialId]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r'(<ArrowLeft size=\{16\} /> Back to Library\n          </Link>)'
replacement = r'\1\n          <div className="ml-auto inline-flex items-center text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">ID: AJH-{resolvedParams.materialId.slice(-6).toUpperCase()}</div>'
content = re.sub(pattern, replacement, content)
content = content.replace('className="mb-6"', 'className="mb-6 flex justify-between items-center"')

with open('src/app/study-materials/[materialId]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Study Material Details with Feed ID")
