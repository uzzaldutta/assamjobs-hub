import re

with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Job Type dropdown to show Subjects if category is STUDY_MATERIAL
job_type_pattern = r'(<div className="space-y-1">\s*<label className="text-sm font-semibold">Job Type / Level</label>\s*<select name="job_type" value=\{formData\.job_type\} onChange=\{handleChange\} className="w-full p-2\.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">.*?</select>\s*</div>)'

job_type_repl = r'''<div className="space-y-1">
                  <label className="text-sm font-semibold">{formData.category === "STUDY_MATERIAL" ? "Study Material Subject" : "Job Type / Level"}</label>
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
                      <option value="ASSAM_STATE">Assam State Govt</option>
                      <option value="CENTRAL_GOVT">Central Government</option>
                      <option value="PSU">Public Sector (PSU)</option>
                      <option value="BANKING">Banking & Finance</option>
                      <option value="DEFENCE">Defence / Police</option>
                      <option value="PRIVATE">Private Job</option>
                      <option value="LOCAL_PRIVATE">Local Private (Assam)</option>
                      <option value="EXAM_UPDATE">Exam Update</option>
                      <option value="RESULT">Result</option>
                      <option value="ADMIT_CARD">Admit Card</option>
                      <option value="TENDER">Tender / Notice</option>
                      <option value="INFRASTRUCTURE">Infrastructure Project</option>
                    </select>
                  )}
                </div>'''

content = re.sub(job_type_pattern, job_type_repl, content, flags=re.DOTALL)

with open('src/app/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
