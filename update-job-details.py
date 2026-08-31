with open('src/app/jobs/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r'(<span className=\{`text-\[10px\] uppercase tracking-wider font-bold px-2\.5 py-1 rounded-full \$\{isPrivate \? \'.*?\' : \'.*?\'\}`\}>\n\s*\{\(job\.type \|\| job\.job_type \|\| "JOB"\)\.replace\(\'_\', \' \'\)\}\n\s*</span>)'
replacement = r'\1\n          <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-mono border border-slate-200 dark:border-slate-700">\n            ID: AJH-{id.slice(-6).toUpperCase()}\n          </span>'
content = re.sub(pattern, replacement, content)

with open('src/app/jobs/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Job Details with Feed ID")
