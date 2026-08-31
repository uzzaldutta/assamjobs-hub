with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to thead
content = content.replace('<th className="p-4 font-semibold">Title</th>', '<th className="p-4 font-semibold">Feed ID</th>\n                        <th className="p-4 font-semibold">Title</th>')

# Add to tbody
content = content.replace('<td className="p-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate" \ntitle={job.title}>', '<td className="p-4 font-mono text-xs text-slate-500 max-w-[120px] truncate" title={job.id}>\n                            {job.id}\n                          </td>\n                          <td className="p-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate" \ntitle={job.title}>')

# Add to tbody 2 (because of newlines, I will use regex)
import re
pattern = r'(<td className="p-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate" \s*title=\{job.title\}>)'
replacement = r'<td className="p-4 font-mono text-xs text-slate-500 max-w-[120px] truncate" title={job.id}>\n                            {job.id}\n                          </td>\n                          \1'
content = re.sub(pattern, replacement, content)

with open('src/app/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Admin table with Feed ID")
