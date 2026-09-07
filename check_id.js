const fs = require("fs");
const content = fs.readFileSync("src/app/admin/studio/ingestion/queue/[id]/page.tsx", "utf-8");
if(content.includes("handleApprove")) console.log("Found handleApprove!");
else console.log("Not found.");
