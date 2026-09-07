const fs = require("fs");
const content = fs.readFileSync("src/app/admin/studio/ingestion/queue/[id]/page.tsx", "utf-8");
console.log(content.substring(content.indexOf("<form action={handleReject}"), content.indexOf("<form action={handleReject}") + 500));
