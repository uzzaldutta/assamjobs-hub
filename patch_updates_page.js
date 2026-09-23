const fs = require('fs');
let p = 'src/app/updates/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "supabase.from('admissions').select('*').eq('status', 'PUBLISHED')",
  "supabase.from('jobs').select('*').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION')"
);

fs.writeFileSync(p, c);
console.log("Patched admissions table query in updates page");
