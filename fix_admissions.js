const fs = require('fs');

let content = fs.readFileSync('src/app/admissions/page.tsx', 'utf8');

content = content.replace(".eq('job_type', 'ADMISSION');", ".or('job_type.eq.ADMISSION,title.ilike.%admission%');");

fs.writeFileSync('src/app/admissions/page.tsx', content);
console.log("Fixed admissions/page.tsx");
