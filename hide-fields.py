with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fields to hide when it's a study material or previous paper
fields_to_wrap = [
    """<div className="space-y-1">
                <label className="text-sm font-semibold">Vacancies (Optional)</label>
                <input type="text" name="vacancies" value={formData.vacancies} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>""",
    """<div className="space-y-1">
                <label className="text-sm font-semibold">Last Date (Optional)</label>
                <input type="date" name="last_date" value={formData.last_date} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>""",
    """<div className="space-y-1">
                <label className="text-sm font-semibold">Apply URL (Optional)</label>
                <input type="url" name="apply_url" value={formData.apply_url} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              </div>"""
]

for field in fields_to_wrap:
    new_field = f"""{{formData.category !== "STUDY_MATERIAL" && formData.category !== "PREVIOUS_PAPERS" && (
              {field}
            )}}"""
    content = content.replace(field, new_field)

# Change the "AI Auto-Fill" block to be hidden too
auto_fill_block = """<div className="md:col-span-2 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Shield size={18} />
                </div>
                <h3 className="font-bold text-lg">AI Auto-Fill from URL</h3>
              </div>"""

new_auto_fill = """{formData.category !== "STUDY_MATERIAL" && formData.category !== "PREVIOUS_PAPERS" && (
<div className="md:col-span-2 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Shield size={18} />
                </div>
                <h3 className="font-bold text-lg">AI Auto-Fill from URL</h3>
              </div>"""

content = content.replace(auto_fill_block, new_auto_fill)

# Close the auto-fill block correctly
auto_fill_end = """                  Auto-Fill Text
                </button>
              </div>
            </div>"""

new_auto_fill_end = """                  Auto-Fill Text
                </button>
              </div>
            </div>
            )}"""

content = content.replace(auto_fill_end, new_auto_fill_end)

with open('src/app/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fields hidden cleanly")
