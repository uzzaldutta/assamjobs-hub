const fs = require('fs');
const content = fs.readFileSync('src/app/admin/studio/ingestion/queue/[id]/page.tsx', 'utf8');
if(content.includes('Feed ID')) console.log("Feed ID found");
else console.log("Feed ID NOT found");
