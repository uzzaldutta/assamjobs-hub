import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update limits from 15/10 to 30 for govtJobs, privateJobs, closingSoonJobs
content = re.sub(r'(\.eq\(\'job_type\', \'GOVERNMENT\'\)\s*\n\s*\.order\(.*?\)\s*\n\s*\.limit\()15(\))', r'\g<1>30\g<2>', content)
content = re.sub(r'(\.eq\(\'job_type\', \'PRIVATE\'\)\s*\n\s*\.order\(.*?\)\s*\n\s*\.limit\()10(\))', r'\g<1>30\g<2>', content)
content = re.sub(r'(\.lte\(\'last_date\', .*?\)\s*\n\s*\.order\(.*?\)\s*\n\s*\.limit\()15(\))', r'\g<1>30\g<2>', content)

# 2. Wrap Latest Government Jobs
govt_grid_pattern = r'(<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">\s*\{govtJobs\?\.map\(job => \(\s*<JobCard key=\{job\.id\} job=\{job\} />\s*\)\)\}\s*\{\(!govtJobs \|\| govtJobs\.length === 0\) && \(\s*<div className="col-span-full py-12 text-center text-slate-500">No recent government jobs found\.</div>\s*\)\}\s*</div>)'
govt_replacement = r'''<div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4">
            <div className="h-[600px] overflow-y-auto custom-scroll pr-2">
              \1
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50/90 dark:from-slate-900/90 to-transparent pointer-events-none rounded-b-2xl"></div>
          </div>'''
content = re.sub(govt_grid_pattern, govt_replacement, content, flags=re.DOTALL)

# 3. Wrap Latest Private Jobs
private_grid_pattern = r'(<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">\s*\{privateJobs\?\.map\(job => \(\s*<JobCard key=\{job\.id\} job=\{job\} />\s*\)\)\}\s*\{\(!privateJobs \|\| privateJobs\.length === 0\) && \(\s*<div className="col-span-full py-12 text-center text-slate-500">No recent private jobs found\.</div>\s*\)\}\s*</div>)'
private_replacement = r'''<div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4">
            <div className="h-[600px] overflow-y-auto custom-scroll pr-2">
              \1
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50/90 dark:from-slate-900/90 to-transparent pointer-events-none rounded-b-2xl"></div>
          </div>'''
content = re.sub(private_grid_pattern, private_replacement, content, flags=re.DOTALL)

# 4. Wrap Closing Soon
closing_grid_pattern = r'(<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">\s*\{closingSoonJobs\.map\(job => \(\s*<JobCard key=\{job\.id\} job=\{job\} />\s*\)\)\}\s*</div>)'
closing_replacement = r'''<div className="relative rounded-2xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-900/10 p-4">
                <div className="h-[600px] overflow-y-auto custom-scroll pr-2">
                  \1
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-50/90 dark:from-slate-900/90 to-transparent pointer-events-none rounded-b-2xl"></div>
              </div>'''
content = re.sub(closing_grid_pattern, closing_replacement, content, flags=re.DOTALL)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated src/app/page.tsx")
