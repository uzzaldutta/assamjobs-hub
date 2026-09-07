import re

with open("src/app/admin/studio/ingestion/queue/[id]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if 'extractAdvtNo' not in content:
    content = content.replace('import { supabaseAdmin as supabase } from "@/lib/supabase";', 'import { supabaseAdmin as supabase } from "@/lib/supabase";\nimport { extractAdvtNo } from "@/lib/ingestion/duplicate-matcher";')

# Add Advt No calculation
if 'const advtNo =' not in content:
    content = content.replace('const payload = item.normalized_payload || {};', 'const payload = item.normalized_payload || {};\n  const advtNo = extractAdvtNo(payload.title) || extractAdvtNo(item.raw_payload?.description);')

# Add Feed ID and Advt No to UI
# Top title section
pattern = re.compile(r'(<h1 className="text-2xl font-black text-slate-900 mb-2">.*?</h1>)', re.DOTALL)
replacement = r'\1\n          <div className="flex gap-4 text-sm font-mono text-slate-500 mb-4">\n            <span title="Feed ID">ID: {item.id}</span>\n            {advtNo && <span title="Advertisement Number">| Advt: {advtNo}</span>}\n          </div>'
content = pattern.sub(replacement, content, count=1)

with open("src/app/admin/studio/ingestion/queue/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated queue/[id]/page.tsx")
