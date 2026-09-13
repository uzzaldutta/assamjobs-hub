const fs = require('fs');

// 1. Fix JobAssamHubAdapter.ts
let adapterPath = 'src/lib/ingestion/adapters/JobAssamHubAdapter.ts';
let adapterContent = fs.readFileSync(adapterPath, 'utf8');
adapterContent = adapterContent.replace('const headers = [];', 'const headers: string[] = [];');
adapterContent = adapterContent.replace('const row = [];', 'const row: string[] = [];');
adapterContent = adapterContent.replace('return headers.push($(th).text().trim());', 'headers.push($(th).text().trim());');
fs.writeFileSync(adapterPath, adapterContent);

// 2. Fix feed.xml/route.ts
let feedPath = 'src/app/feed.xml/route.ts';
if (fs.existsSync(feedPath)) {
    let feedContent = fs.readFileSync(feedPath, 'utf8');
    feedContent = feedContent.replace('function escapeXml(unsafe) {', 'function escapeXml(unsafe: string) {');
    feedContent = feedContent.replace('return unsafe.replace(/[<>&\'"]/g, function (c) {', 'return unsafe.replace(/[<>&\'"]/g, function (c: string) {');
    fs.writeFileSync(feedPath, feedContent);
}

console.log("Fixed TS errors");
