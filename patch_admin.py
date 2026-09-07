import re

with open("src/app/admin/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add Lucide icons
import_match = re.search(r'import \{([^}]+)\} from "lucide-react";', content)
if import_match:
    icons = import_match.group(1)
    if "Database" not in icons:
        new_icons = icons + ", Database, Activity, LayoutDashboard, FileCheck"
        content = content.replace(import_match.group(0), f'import {{{new_icons}}} from "lucide-react";')

grid_html = """
        {/* UNIVERSAL ADMIN HUB QUICK LINKS */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Universal Content Studio</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/studio/ingestion" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:border-indigo-500 hover:shadow-md transition group flex flex-col gap-2">
              <div className="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg w-fit"><Database size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Ingestion Engine</h3>
                <p className="text-xs text-slate-500 mt-1">Manage sources & extractors</p>
              </div>
            </Link>
            
            <Link href="/admin/studio/ingestion/queue" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:border-emerald-500 hover:shadow-md transition group flex flex-col gap-2">
              <div className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg w-fit"><FileCheck size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Review Queue</h3>
                <p className="text-xs text-slate-500 mt-1">Approve pending jobs & duplicates</p>
              </div>
            </Link>

            <Link href="/admin/studio/ingestion/reports" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:border-amber-500 hover:shadow-md transition group flex flex-col gap-2">
              <div className="text-amber-600 bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg w-fit"><Activity size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Daily Operations</h3>
                <p className="text-xs text-slate-500 mt-1">Daily feed and health reports</p>
              </div>
            </Link>

            <Link href="/admin/studio" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:border-fuchsia-500 hover:shadow-md transition group flex flex-col gap-2">
              <div className="text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/30 p-2 rounded-lg w-fit"><LayoutDashboard size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Exam Prep Studio</h3>
                <p className="text-xs text-slate-500 mt-1">Mock tests, questions, and PDFs</p>
              </div>
            </Link>
          </div>
        </div>
        
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Legacy Management Tools</h2>
"""

content = content.replace("{/* CMS Tabs */}", grid_html + "        {/* CMS Tabs */}")

with open("src/app/admin/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected Universal Admin Hub Links into admin/page.tsx")
