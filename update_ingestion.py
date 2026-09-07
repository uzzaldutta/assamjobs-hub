import re

with open("src/app/admin/studio/ingestion/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the single button with a flex row of two buttons.
old_button = r'<Link href="/admin/studio/ingestion/queue" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition flex items-center gap-2 shadow-sm">\s*<Database size={18} /> Review Queue\s*\{queueCount \? <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-full text-xs ml-2">\{queueCount\}</span> : null\}\s*</Link>'
new_buttons = """<div className="flex items-center gap-3">
          <Link href="/admin/studio/ingestion/reports" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-6 py-2.5 rounded-lg font-bold transition flex items-center gap-2 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700">
            <FileSearch size={18} /> Daily Feed Report
          </Link>
          <Link href="/admin/studio/ingestion/queue" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition flex items-center gap-2 shadow-sm">
            <Database size={18} /> Review Queue
            {queueCount ? <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-full text-xs ml-2">{queueCount}</span> : null}
          </Link>
        </div>"""

content = re.sub(old_button, new_buttons, content)

with open("src/app/admin/studio/ingestion/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated ingestion page links")
