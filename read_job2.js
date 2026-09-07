const fs = require('fs');
console.log(fs.readFileSync('src/app/jobs/[id]/page.tsx', 'utf8').substring(1000, 3000));
