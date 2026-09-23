const fs = require('fs');

let p = 'src/app/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const target = `<LatestUpdatesScroller recentItems={allRecent} closingSoonItems={allClosing} />`;
const repl = `<LatestUpdatesScroller recentItems={allRecent} closingSoonItems={allClosing} />\n\n        {/* CLASSIC 3-COLUMN BOARD */}\n        <ClassicUpdatesBoard />`;

c = c.replace(target, repl);
fs.writeFileSync(p, c);
console.log("Patched page.tsx successfully");
