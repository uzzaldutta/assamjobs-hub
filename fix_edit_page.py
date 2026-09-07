import re

with open("src/app/admin/edit/[id]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if 'extractAdvtNo' not in content:
    content = content.replace('import { redirect } from "next/navigation";', 'import { redirect } from "next/navigation";\nimport { extractAdvtNo } from "@/lib/ingestion/duplicate-matcher";')
    content = content.replace('import { notFound } from "next/navigation";', 'import { notFound } from "next/navigation";\nimport { extractAdvtNo } from "@/lib/ingestion/duplicate-matcher";') # fallback if redirect isn't there

# Extract Advt No
if 'const advtNo =' not in content:
    content = content.replace('const job = data;', 'const job = data;\n  const advtNo = extractAdvtNo(job.title) || extractAdvtNo(job.unique_description);')

# Insert Feed ID and Advt No under the h1
pattern = re.compile(r'(<h1 className="text-2xl font-bold text-slate-800">Edit Job: \{job\.title\}</h1>)')
replacement = r'\1\n        <div className="flex gap-4 mt-2 text-sm text-slate-500 font-mono">\n          <span title="Feed ID">Feed ID: {job.id}</span>\n          {advtNo && <span title="Advertisement Number">| Advt No: {advtNo}</span>}\n        </div>'
content = pattern.sub(replacement, content, count=1)

with open("src/app/admin/edit/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated edit/[id]/page.tsx")
