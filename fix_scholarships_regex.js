const fs = require('fs');

let content = fs.readFileSync('src/app/scholarships/page.tsx', 'utf8');

// The exact string replacement failed because of \r\n, use regex instead.
content = content.replace(/.from\('scholarships'\)/, ".from('jobs')");
content = content.replace(/.eq\('status', 'PUBLISHED'\);/, ".eq('status', 'PUBLISHED').or('job_type.eq.SCHOLARSHIP,title.ilike.%scholarship%,title.ilike.%scheme%');");

fs.writeFileSync('src/app/scholarships/page.tsx', content);
console.log("Fixed page.tsx properly");
