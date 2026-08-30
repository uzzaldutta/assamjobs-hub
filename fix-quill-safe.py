with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove imports
content = content.replace('const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });\n', '')
content = content.replace('import "react-quill/dist/quill.snow.css";\n', '')
content = content.replace('import dynamic from "next/dynamic";\n', '')

# 2. Replace the entire block
old_block = """                {formData.category === "STUDY_MATERIAL" ? (
                  <textarea 
                    name="unique_description" 
                    value={formData.unique_description} 
                    onChange={handleChange} 
                    placeholder="Paste raw HTML here for Study Materials..."
                    className="w-full h-96 p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-sm"
                  />
                ) : (
                  <ReactQuill 
                  theme="snow"
                  value={formData.unique_description} 
                  onChange={(val) => setFormData({ ...formData, unique_description: val })}
                  className="bg-slate-50 dark:bg-slate-950 rounded-lg overflow-hidden"
                  style={{ height: '300px', marginBottom: '40px' }}
                />
                )}"""

new_block = """                  <textarea 
                    name="unique_description" 
                    value={formData.unique_description} 
                    onChange={handleChange} 
                    placeholder="Enter description or paste raw HTML here..."
                    className="w-full h-96 p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-sm"
                  />"""

content = content.replace(old_block, new_block)

with open('src/app/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
