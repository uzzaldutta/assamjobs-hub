import os

file_path = "src/app/admin/studio/ingestion/queue/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = """<div className="flex gap-2">
                      {item.duplicate_of && ("""

replacement = """<div className="flex gap-2">
                      <Link href={`/admin/studio/ingestion/queue/${item.id}`} className="text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 px-4 py-2 rounded flex items-center gap-1 transition">
                        <FileSearch size={14}/> View Details
                      </Link>
                      {item.duplicate_of && ("""

content = content.replace(target, replacement)
if 'import Link from "next/link"' not in content:
    content = content.replace('import {', 'import Link from "next/link";\nimport {', 1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
