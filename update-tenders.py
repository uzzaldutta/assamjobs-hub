with open('src/components/TendersDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r'(<Clock size=\{16\} /> Closes in \{timeRemaining\}\n                    </div>)'
replacement = r'\1\n                    <div className="text-[10px] text-slate-400 font-mono" title="Feed ID">ID: {tender.id}</div>'
content = re.sub(pattern, replacement, content)

with open('src/components/TendersDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated TendersDashboard with Feed ID")
