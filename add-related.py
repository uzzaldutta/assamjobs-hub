import re

with open('src/app/jobs/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import AdminEditButton from "@/components/AdminEditButton";',
    'import AdminEditButton from "@/components/AdminEditButton";\nimport JobCard from "@/components/JobCard";'
)

fetch_pattern = re.compile(r'(if \(!job\) \{\s*return \(\s*<div.*?</div>\s*\);\s*\})', re.DOTALL)
insert_fetch = r'''\1

  let relatedJobs: any[] = [];
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('category', job.category)
      .neq('id', job.id)
      .order('scraped_at', { ascending: false })
      .limit(4);
      
    if (data) {
      relatedJobs = data.map((j: any) => ({
        ...j,
        type: j.job_type,
        lastDate: j.last_date,
        createdAt: new Date(j.scraped_at || j.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      }));
    }
  } catch(e) {}
'''
content = fetch_pattern.sub(insert_fetch, content)

render_pattern = re.compile(r'(<ShareButtons title=\{job\.title\} />\s*</div>)', re.DOTALL)
insert_render = r'''\1

        {relatedJobs.length > 0 && (
          <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 mb-12">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Similar Jobs You Might Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedJobs.map((relatedJob: any) => (
                <JobCard key={relatedJob.id} job={relatedJob} />
              ))}
            </div>
          </div>
        )}
'''
content = render_pattern.sub(insert_render, content)

with open('src/app/jobs/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
