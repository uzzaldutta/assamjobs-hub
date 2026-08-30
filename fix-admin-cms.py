import re

with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add STUDY_MATERIAL to Category dropdown
cat_pattern = r'<option value="BANKING">Banking</option>'
cat_repl = r'<option value="BANKING">Banking</option>\n                    <option value="STUDY_MATERIAL">Study Material (HTML)</option>'
content = re.sub(cat_pattern, cat_repl, content)

# 2. Add raw HTML toggle for unique_description
desc_pattern = r'(<div className="space-y-1 col-span-1 md:col-span-2">\s*<label className="text-sm font-semibold">Detailed Description \(English\).*?</label>)\s*(<ReactQuill.*?/>)'

desc_repl = r'''\1
                  {formData.category === "STUDY_MATERIAL" ? (
                    <textarea 
                      name="unique_description" 
                      value={formData.unique_description} 
                      onChange={handleChange} 
                      placeholder="Paste raw HTML here for Study Materials..."
                      className="w-full h-96 p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-sm"
                    />
                  ) : (
                    \2
                  )}'''
content = re.sub(desc_pattern, desc_repl, content, flags=re.DOTALL)

with open('src/app/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
