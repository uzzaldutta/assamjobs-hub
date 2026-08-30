with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add STUDY_MATERIAL to Category Subject dropdown
cat_pattern = '<option value="CURRENT_AFFAIRS">Current Affairs & GK</option>'
cat_repl = '<option value="CURRENT_AFFAIRS">Current Affairs & GK</option>\n                  <option value="STUDY_MATERIAL">Study Material (HTML)</option>'
content = content.replace(cat_pattern, cat_repl)


# 2. Add subjects to Post Type dropdown
job_pattern = """<div className="space-y-1">
                <label className="text-sm font-semibold">Post Type</label>
                <select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <option value="GOVERNMENT">Government Job</option>
                  <option value="PRIVATE">Private Job</option>
                  <option value="EXAM_UPDATE">Result / Admit Card</option>
                  <option value="TENDER">Tender</option>
                  <option value="ADMISSION">Admission</option>
                  <option value="STUDY_MATERIAL">Study Material (PDF)</option>
                </select>
              </div>"""

job_repl = """<div className="space-y-1">
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
              </div>"""
content = content.replace(job_pattern, job_repl)


with open('src/app/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
