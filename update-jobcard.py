with open('src/components/JobCard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r'(<span className="text-\[10px\] md:text-\[11px\] text-slate-400 font-medium">\s*Posted: \{job\.createdAt\}\s*</span>)'
replacement = r'<div className="flex flex-col gap-0.5">\n            \1\n            <span className="text-[9px] md:text-[10px] text-slate-400/80 font-mono" title="Feed ID">\n              ID: {job.id}\n            </span>\n          </div>'
content = re.sub(pattern, replacement, content)

with open('src/components/JobCard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated JobCard with Feed ID")
