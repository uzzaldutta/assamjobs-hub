const fs = require('fs');
let pagePath = 'src/app/api/check-single-job/route.ts';
let content = fs.readFileSync(pagePath, 'utf8');

content = content.replace('filter(n => n > 20', 'filter((n: number) => n > 20');
fs.writeFileSync(pagePath, content);
