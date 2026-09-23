const fs = require('fs');

let p = 'src/lib/ingestion/jobassam-firewall.ts';
let c = fs.readFileSync(p, 'utf8');

const oldLogic = `    for (const kw of highPromoExact) {
        if (title.includes(kw) && genuineScore < 5) return "HIGH";
    }`;

const newLogic = `    for (const kw of highPromoExact) {
        // Return HIGH regardless of genuineScore for absolute spam patterns
        if (title.includes(kw)) return "HIGH";
    }`;

c = c.replace(oldLogic, newLogic);
fs.writeFileSync(p, c);
console.log("Patched jobassam-firewall.ts");
