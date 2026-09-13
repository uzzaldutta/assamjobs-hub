const fs = require('fs');

let feedPath = 'src/app/feed.xml/route.ts';
if (fs.existsSync(feedPath)) {
    let feedContent = fs.readFileSync(feedPath, 'utf8');
    feedContent = feedContent.replace('const escapeXml = (unsafe) => {', 'const escapeXml = (unsafe: string) => {');
    feedContent = feedContent.replace('replace(/[<>&\'"]/g, (c) => {', 'replace(/[<>&\'"]/g, (c: string) => {');
    fs.writeFileSync(feedPath, feedContent);
}

let adapterPath = 'src/lib/ingestion/adapters/JobAssamHubAdapter.ts';
let adapterContent = fs.readFileSync(adapterPath, 'utf8');
// error TS2322: Type 'number' is not assignable to type 'boolean | void'.
// In Cheerio `each`, it expects `void` or `boolean`. Returning `headers.push` returns a number.
adapterContent = adapterContent.replace('return headers.push', 'headers.push'); 
fs.writeFileSync(adapterPath, adapterContent);
console.log("Fixed arrow functions");
