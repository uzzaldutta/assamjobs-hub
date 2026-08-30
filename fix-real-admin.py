import re

with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add STUDY_MATERIAL to Category Subject dropdown
cat_pattern = r'<option value="CURRENT_AFFAIRS">Current Affairs & GK</option>'
cat_repl = r'<option value="CURRENT_AFFAIRS">Current Affairs & GK</option>\n                  <option value="STUDY_MATERIAL">Study Material (HTML)</option>'
content = re.sub(cat_pattern, cat_repl, content)


# 2. Add subjects to Post Type dropdown
job_pattern = r'(<div className="space-y-1">\s*<label className="text-sm font-semibold">Post Type</label>\s*<select name="job_type" value=\{formData\.job_type\} onChange=\{handleChange\} className="w-full p-2\.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">.*?</select>\s*</div>)'

job_repl = r'''<div className="space-y-1">
                <label className="text-sm font-semibold">{formData.category === "STUDY_MATERIAL" ? "Study Material Subject" : "Post Type"}</label>
                {formData.category === "STUDY_MATERIAL" ? (
                  <select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                    <option value="HISTORY">History</option>
                    <option value="POLITY">Polity & Governance</option>
                    <option value="GEOGRAPHY">Geography</option>
                    <option value="ECONOMICS">Economics</option>
                    <option value="GENERAL_SCIENCE">General Science</option>
                    <option value="MATH_REASONING">Math & Reasoning</option>
                    <option value="ENGLISH">English</option>
                    <option value="CURRENT_AFFAIRS">Current Affairs</option>
                    <option value="ASSAM_GK">Assam GK</option>
                    <option value="BANKING_AWARENESS">Banking Awareness</option>
                    <option value="COMPUTER">Computer Knowledge</option>
                    <option value="OTHER">Other / Misc</option>
                  </select>
                ) : (
                  <select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                    <option value="GOVERNMENT">Government Job</option>
                    <option value="PRIVATE">Private Job</option>
                    <option value="EXAM_UPDATE">Result / Admit Card</option>
                    <option value="TENDER">Tender</option>
                    <option value="ADMISSION">Admission</option>
                    <option value="STUDY_MATERIAL">Study Material (PDF)</option>
                  </select>
                )}
              </div>'''
content = re.sub(job_pattern, job_repl, content, flags=re.DOTALL)


# 3. Replace ReactQuill conditionally for HTML
desc_pattern = r'(<div className="space-y-1 md:col-span-2">\s*<label className="text-sm font-semibold flex justify-between">\s*<span>Markdown Description \(English\)</span>\s*<span className="text-xs text-indigo-500">Supports Markdown</span>\s*</label>\s*)(<ReactQuill.*?/>)'

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

print("CMS Fixed")
