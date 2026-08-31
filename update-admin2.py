with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Update ID display in CMS
pattern_id = r'<td className="p-4 font-mono text-xs text-slate-500 max-w-\[120px\] truncate" title=\{job.id\}>\n\s*\{job.id\}\n\s*</td>'
replacement_id = r'<td className="p-4 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 max-w-[120px] truncate" title={job.id}>\n                            AJH-{job.id.slice(-6).toUpperCase()}\n                          </td>'
content = re.sub(pattern_id, replacement_id, content)

# Update Date display in CMS
pattern_date = r'<td className="p-4 text-slate-500">\n\s*\{new Date\(job.scraped_at\).toLocaleDateString\(\)\}\n\s*</td>'
replacement_date = r'<td className="p-4 text-slate-500 text-xs">\n                            {new Date(job.scraped_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}\n                          </td>'
content = re.sub(pattern_date, replacement_date, content)

with open('src/app/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Admin page with short ID and formatted date")
