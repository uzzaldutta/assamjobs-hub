import re

with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add the import for PrepDashboard at the top
if 'import PrepDashboard' not in content:
    content = content.replace('import { supabase } from "@/lib/supabase";', 'import { supabase } from "@/lib/supabase";\nimport PrepDashboard from "@/components/admin/PrepDashboard";')

# 2. Add 'prep' to the activeTab type
content = content.replace('<"manage" | "create" | "banners" | "sync" | "spam">', '<"manage" | "create" | "banners" | "sync" | "spam" | "prep">')

# 3. Add the 'prep' button in the CMS Tabs
# I will find the button for 'spam' and add 'prep' after it.
prep_button = """
            <button onClick={() => setActiveTab("prep")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "prep" ? "bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
              <BookOpen size={16} /> Exam Builder
            </button>"""

# Need to import BookOpen if not imported
if 'BookOpen' not in content:
    content = content.replace('import { Shield, PlusCircle, CheckCircle2, AlertCircle, Lock, Edit, Trash2, List, Image, X } from "lucide-react";', 'import { Shield, PlusCircle, CheckCircle2, AlertCircle, Lock, Edit, Trash2, List, Image, X, BookOpen } from "lucide-react";')

# Inject button after spam button
spam_button_pattern = r'(<button onClick=\{\(\) => setActiveTab\("spam"\)\}.*?</button>)'
content = re.sub(spam_button_pattern, r'\1' + prep_button, content, flags=re.DOTALL)

# 4. Add the rendering block for 'prep'
prep_render = """
          {activeTab === "prep" && (
            <PrepDashboard />
          )}"""

manage_render_pattern = r'(\{activeTab === "manage" && \()'
content = re.sub(manage_render_pattern, prep_render + '\n\n          ' + r'\1', content)

with open('src/app/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated admin page with Exam Builder")
