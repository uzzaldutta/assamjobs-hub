const fs = require('fs');
let p = 'src/app/api/webhooks/ingest/route.ts';
let c = fs.readFileSync(p, 'utf8');

const spamCheck = `
          // HARD SPAM BLOCKLIST
          const lowerTitle = (record.title || '').toLowerCase();
          if (lowerTitle.includes('bio-data') || lowerTitle.includes('whatsapp') || lowerTitle.includes('telegram') || lowerTitle.includes('resume maker')) {
             console.log("Hard spam block hit: " + record.title);
             continue;
          }
`;

if (!c.includes('HARD SPAM BLOCKLIST')) {
    c = c.replace('// --- SPAM DETECTION ---', spamCheck + '\n          // --- SPAM DETECTION ---');
    fs.writeFileSync(p, c);
}
