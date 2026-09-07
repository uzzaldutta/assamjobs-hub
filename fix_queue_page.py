import re

with open("src/app/admin/studio/ingestion/queue/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if 'extractAdvtNo' not in content:
    content = content.replace('import { ShieldCheck, ShieldAlert, FileSearch, CheckCircle, XCircle, Search } from "lucide-react";', 'import { ShieldCheck, ShieldAlert, FileSearch, CheckCircle, XCircle, Search, FileText } from "lucide-react";\nimport { extractAdvtNo } from "@/lib/ingestion/duplicate-matcher";')

# Calculate Advt No
if 'const advtNo =' not in content:
    content = content.replace('const payload = item.normalized_payload || {};', 'const payload = item.normalized_payload || {};\n            const advtNo = extractAdvtNo(payload.title);')

# Insert Feed ID and Advt No
# Below <div className="text-sm text-slate-600 truncate mb-2">{payload.organization || 'No Organization'}</div>
pattern = re.compile(r'(<div className="text-sm text-slate-600 truncate mb-2">\{payload\.organization \|\| \'No Organization\'\}</div>)')
replacement = r'\1\n                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-mono mb-2">\n                    <span title="Feed ID">ID: {item.id.split("-")[0]}</span>\n                    {advtNo && <span className="text-slate-500 font-bold flex items-center gap-1"><FileText size={10}/> Advt: {advtNo}</span>}\n                  </div>'
content = pattern.sub(replacement, content)

with open("src/app/admin/studio/ingestion/queue/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated queue/page.tsx")
