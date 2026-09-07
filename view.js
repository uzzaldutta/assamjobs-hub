const fs = require('fs');
const content = fs.readFileSync('src/app/jobs/[id]/page.tsx', 'utf-8');
console.log(content.substring(0, 3000));
