import os
import re

file_path = "src/app/admin/studio/ingestion/queue/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the button block to include View Details
new_block = """
                    <div className="flex gap-2">
                      <Link href={`/admin/studio/ingestion/queue/${item.id}`} className="text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 px-4 py-2 rounded flex items-center gap-1 transition">
                        <FileSearch size={14}/> View Details
                      </Link>
                      {item.duplicate_of && (
                        <button className="text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded flex items-center gap-1 shadow-sm"><FileSearch size={14}/> View Duplicate</button>
                      )}
"""

content = content.replace("""
                    <div className="flex gap-2">
                      {item.duplicate_of && (""", new_block)

# add Link import if missing
if 'import Link' not in content:
    content = content.replace('import {', 'import Link from "next/link";\nimport {', 1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
