const fs = require('fs');

const file = 'src/app/jobs/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add JobCard to imports
content = content.replace(
  /import AdminEditButton from "@\/components\/AdminEditButton";/,
  'import AdminEditButton from "@/components/AdminEditButton";\nimport JobCard from "@/components/JobCard";'
);

// 2. Fetch related jobs inside the component
// The try-catch block for fetching the job ends with: if (!job) { return ( <div ...> Job not found </div> ); }
const fetchRelatedPattern = /if \(!job\) \{\n\s*return \(\n\s*<div.*?<\/div>\n\s*\);\n\s*\}/s;

const match = content.match(fetchRelatedPattern);
if (match) {
  const insertCode = 
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
  ;
  content = content.replace(fetchRelatedPattern, match[0] + '\n' + insertCode);
} else {
  console.log("Could not find the insertion point for related jobs fetch.");
}

// 3. Render related jobs at the bottom
const renderRelatedPattern = /<ShareButtons title=\{job\.title\} \/>\n\s*<\/div>\n\n\s*<div className="mt-12 mb-12 flex justify-center">/s;
const renderMatch = content.match(renderRelatedPattern);
if (renderMatch) {
  const renderCode = 
        <ShareButtons title={job.title} />
        </div>

        {relatedJobs.length > 0 && (
          <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 mb-12">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Similar Jobs You Might Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedJobs.map((relatedJob) => (
                <JobCard key={relatedJob.id} job={relatedJob} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 mb-12 flex justify-center">;
  content = content.replace(renderRelatedPattern, renderCode);
} else {
  console.log("Could not find the insertion point for related jobs render.");
}

fs.writeFileSync(file, content, 'utf8');
console.log("Done");
