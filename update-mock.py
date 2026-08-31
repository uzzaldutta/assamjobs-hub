with open('src/app/mock-tests/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r'(<h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 group-hover:text-blue-600 \ndark:group-hover:text-blue-400 transition-colors leading-tight">\n\s*\{test\.title\}\n\s*</h3>)'
replacement = r'<h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{test.title}</h3><div className="text-[10px] text-slate-400 font-mono mb-4">ID: AJH-{test.id.slice(-6).toUpperCase()}</div>'

content = re.sub(pattern, replacement, content)

with open('src/app/mock-tests/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Mock Tests with Feed ID")
