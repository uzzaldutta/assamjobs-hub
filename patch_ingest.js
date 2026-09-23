const fs = require('fs');
let p = 'src/app/api/webhooks/ingest/route.ts';
let c = fs.readFileSync(p, 'utf8');

const oldList = `if (lowerTitle.includes('bio-data') || lowerTitle.includes('whatsapp') || lowerTitle.includes('telegram') || lowerTitle.includes('resume maker')) {`;
const newList = `if (lowerTitle.includes('bio-data') || lowerTitle.includes('whatsapp') || lowerTitle.includes('telegram') || lowerTitle.includes('resume maker') || lowerTitle.includes('image resizer') || lowerTitle.includes('image combiner') || lowerTitle.includes('images to pdf') || lowerTitle.includes('qr code') || lowerTitle.includes('advertise with us') || lowerTitle.includes('advertising') || lowerTitle.includes('converter tool')) {`;

c = c.replace(oldList, newList);
fs.writeFileSync(p, c);
console.log("Patched ingest blocklist");
