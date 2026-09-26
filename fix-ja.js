
const fs = require("fs");
let ja = fs.readFileSync("src/lib/ingestion/adapters/JobAssamAdapter.ts", "utf8");
ja = ja.replace(/notificationUrl\s*\};/, "notificationUrl,\n      descriptionHTML: $(\".entry-content\").html() || \"\"\n    };");
ja = ja.replace(/externalId: extracted.url\s*\};/, "externalId: extracted.url,\n      description: extracted.descriptionHTML\n    };");
fs.writeFileSync("src/lib/ingestion/adapters/JobAssamAdapter.ts", ja);
