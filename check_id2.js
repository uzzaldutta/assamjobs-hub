const fs = require("fs");
const content = fs.readFileSync("src/app/admin/studio/ingestion/queue/[id]/page.tsx", "utf-8");
console.log(content.substring(content.indexOf("handleApprove") - 200, content.indexOf("handleApprove") + 600));
