const fs = require('fs');

// 1. scrape-nfr
let p1 = 'src/app/api/jobs/scrape-nfr/route.ts';
let c1 = fs.readFileSync(p1, 'utf8');
const target1 = `      if (!existing || existing.length === 0) {
        await supabase.from('jobs').insert(job);
        inserted++;
      }`;
const repl1 = `      if (!existing || existing.length === 0) {
        const { data: newJob } = await supabase.from('jobs').insert(job).select('id').single();
        if (newJob) {
          revalidatePath(\`/jobs/\${newJob.id}\`);
        }
        inserted++;
      }`;
c1 = c1.replace(target1, repl1);
c1 = c1.replace("revalidatePath('/jobs/[id]', 'page');", "// Broad invalidation removed");
fs.writeFileSync(p1, c1);
console.log("Patched scrape-nfr");

// 2. sync
let p2 = 'src/app/api/jobs/sync/route.ts';
let c2 = fs.readFileSync(p2, 'utf8');
const target2 = `        if ((hasVacancies || hasLastDate) && (!existing || existing.length === 0)) {
          await supabase.from('jobs').insert({
            title: job.title,
            organization: job.organization,
            job_type: job.jobType,
            category: job.category,
            vacancies: job.vacancies,
            district: job.district,
            apply_url: job.applyUrl
          });
          inserted++;
        }`;
const repl2 = `        if ((hasVacancies || hasLastDate) && (!existing || existing.length === 0)) {
          const { data: newJob } = await supabase.from('jobs').insert({
            title: job.title,
            organization: job.organization,
            job_type: job.jobType,
            category: job.category,
            vacancies: job.vacancies,
            district: job.district,
            apply_url: job.applyUrl
          }).select('id').single();
          if (newJob) {
            revalidatePath(\`/jobs/\${newJob.id}\`);
          }
          inserted++;
        }`;
c2 = c2.replace(target2, repl2);
c2 = c2.replace("revalidatePath('/jobs/[id]', 'page');", "// Broad invalidation removed");
fs.writeFileSync(p2, c2);
console.log("Patched sync");
