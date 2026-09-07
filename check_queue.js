const fs = require('fs');
const content = fs.readFileSync('src/app/admin/studio/ingestion/queue/page.tsx', 'utf8');
if(content.includes('Feed ID') || content.includes('item.id.split')) console.log("Feed ID found");
else console.log("Feed ID NOT found");
