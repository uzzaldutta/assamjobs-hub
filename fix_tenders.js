const fs = require('fs');
let p = 'src/app/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/tenders'\)\.select\('id, slug,/g, "tenders').select('id,");
c = c.replace(/scholarships'\)\.select\('id, slug,/g, "scholarships').select('id,");

fs.writeFileSync(p, c);
console.log("Fixed page.tsx tender/scholarship queries");
