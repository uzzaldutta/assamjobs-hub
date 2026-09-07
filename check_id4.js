const fs = require("fs");
const content = fs.readFileSync("src/app/admin/studio/ingestion/queue/[id]/page.tsx", "utf-8");
const lines = content.split('\n');
for (let i = 100; i < 115; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
