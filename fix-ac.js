
const fs = require("fs");
let ac = fs.readFileSync("src/lib/ingestion/adapters/AssamCareerAdapter.ts", "utf8");
ac = ac.replace(/notificationUrl\s*\};/, "notificationUrl,\n      descriptionHTML: $(\".post-body\").html() || \"\"\n    };");
ac = ac.replace(/externalId: extracted.url\s*\};/, "externalId: extracted.url,\n      description: extracted.descriptionHTML\n    };");
fs.writeFileSync("src/lib/ingestion/adapters/AssamCareerAdapter.ts", ac);
