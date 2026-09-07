import re

with open("src/app/admin/studio/ingestion/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the table wrapper
content = content.replace(
    '<div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">',
    '<div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">'
)

with open("src/app/admin/studio/ingestion/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Table overflow fixed")
