import re

with open("src/components/JobCard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if 'extractAdvtNo' not in content:
    content = content.replace('import { useBookmarks } from "@/hooks/useBookmarks";', 'import { useBookmarks } from "@/hooks/useBookmarks";\nimport { extractAdvtNo } from "@/lib/ingestion/duplicate-matcher";')

# Inject Advt No processing
if 'const advtNo = extractAdvtNo' not in content:
    content = content.replace('let deadlineState = "ACTIVE";', 'const advtNo = extractAdvtNo(job.title) || extractAdvtNo(job.unique_description);\n\n  let deadlineState = "ACTIVE";')

# Add Feed ID and Advt No to the UI
# Let's put Feed ID next to the Category badge
pattern_badge = re.compile(r'(<span className=\{`text-\[10px\] md:text-xs font-black uppercase tracking-wider px-2 py-0\.5 rounded-md[^>]+>\s*\{job\.job_type \|\| \'JOB\'\}\s*</span>)')
replacement_badge = r'\1\n            <span className="text-[10px] md:text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700" title="Feed ID">ID: {job.id.split("-")[0]}</span>'
content = pattern_badge.sub(replacement_badge, content)

# Add Advt No below the Organization
pattern_org = re.compile(r'(\{job\.organization && \(\s*<p className="text-slate-600 dark:text-slate-400 font-medium text-sm flex items-center gap-1\.5">\s*<Building2 size=\{14\} className="opacity-70 shrink-0" /> <span className="truncate">\{job\.organization\}</span>\s*</p>\s*\)\})')
replacement_org = r'\1\n        {advtNo && (\n          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs flex items-center gap-1.5 mt-1">\n            <FileText size={12} className="opacity-70 shrink-0" /> <span className="truncate">Advt: {advtNo}</span>\n          </p>\n        )}'
content = pattern_org.sub(replacement_org, content)

with open("src/components/JobCard.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated JobCard.tsx")
