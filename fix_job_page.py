import re

with open("src/app/jobs/[id]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if 'extractAdvtNo' not in content:
    content = content.replace('import { notFound } from "next/navigation";', 'import { notFound } from "next/navigation";\nimport { extractAdvtNo } from "@/lib/ingestion/duplicate-matcher";')

if 'const advtNo =' not in content:
    content = content.replace('const isVerified = job.status === \'PUBLISHED\' && job.verification_status === \'VERIFIED\';', 'const isVerified = job.status === \'PUBLISHED\' && job.verification_status === \'VERIFIED\';\n  const advtNo = extractAdvtNo(job.title) || extractAdvtNo(job.unique_description);')

# Add Feed ID and Advt No to the UI
# Let's add them to the top badge section
pattern_badges = re.compile(r'(<span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">.*?</span>)', re.DOTALL)
replacement_badges = r'\1\n            <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200" title="Feed ID">\n              ID: {job.id.split("-")[0]}\n            </span>'
content = pattern_badges.sub(replacement_badges, content, count=1)

# Add Advt No under the organization
pattern_org = re.compile(r'(\{job\.organization && \(\s*<div className="flex items-center gap-2 text-lg font-medium text-slate-600 dark:text-slate-300 mb-6">\s*<Building2 size=\{20\} className="text-slate-400" />\s*<span>\{job\.organization\}</span>\s*</div>\s*\)\})')
replacement_org = r'\1\n          {advtNo && (\n            <div className="flex items-center gap-2 text-md font-bold text-slate-500 dark:text-slate-400 mb-6 -mt-3">\n              <FileText size={18} className="text-slate-400" />\n              <span>Advt No: {advtNo}</span>\n            </div>\n          )}'
content = pattern_org.sub(replacement_org, content)

with open("src/app/jobs/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated jobs/[id]/page.tsx")
