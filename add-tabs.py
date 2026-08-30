import re

with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add the new tabs
tabs_pattern = r'<button onClick=\{\(\) => setActiveTab\("create"\)\} className=\{`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all \$\{activeTab === "create" \? "bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"\} `\}>\s*<PlusCircle size=\{16\} /> Create Post\s*</button>'

new_tabs = '''<button onClick={() => setActiveTab("create")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "create" ? "bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"} `}>
            <PlusCircle size={16} /> Post Job
          </button>
          <button onClick={() => { setActiveTab("create"); setFormData({...formData, category: "STUDY_MATERIAL"}); }} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "create" && formData.category === "STUDY_MATERIAL" ? "bg-white dark:bg-slate-700 shadow text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"} `}>
            <PlusCircle size={16} /> Study Material
          </button>
          <button onClick={() => { setActiveTab("create"); setFormData({...formData, category: "PREVIOUS_PAPERS"}); }} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "create" && formData.category === "PREVIOUS_PAPERS" ? "bg-white dark:bg-slate-700 shadow text-amber-600 dark:text-amber-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"} `}>
            <PlusCircle size={16} /> Question Paper
          </button>'''

content = re.sub(tabs_pattern, new_tabs, content)

with open('src/app/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added sub-tabs")
