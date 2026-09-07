const fs = require('fs');
const content = fs.readFileSync('src/app/admin/edit/[id]/page.tsx', 'utf8');
if(content.includes('Feed ID') || content.includes('Advt')) console.log("Feed ID / Advt found in edit page");
else console.log("NOT found in edit page");
