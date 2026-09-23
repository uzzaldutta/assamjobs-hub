const fs = require('fs');

// Fix ClassicUpdatesBoard.tsx
let p1 = 'src/components/ClassicUpdatesBoard.tsx';
let c1 = fs.readFileSync(p1, 'utf8');

if (!c1.includes('const uniqueUpdates')) {
  c1 = c1.replace(
    '.slice(0, 15); // Show top 15 mixed items',
    '.slice(0, 15);\n\n  const uniqueUpdates = [];\n  const seenIds = new Set();\n  for (const item of latestUpdates) {\n    if (!seenIds.has(item.id)) {\n      seenIds.add(item.id);\n      uniqueUpdates.push(item);\n    }\n  }'
  );
  c1 = c1.replace(/\{latestUpdates\.map/g, '{uniqueUpdates.map');
  fs.writeFileSync(p1, c1);
  console.log("Patched ClassicUpdatesBoard.tsx for UI deduplication");
}

// Fix page.tsx LatestUpdatesScroller input
let p2 = 'src/app/page.tsx';
let c2 = fs.readFileSync(p2, 'utf8');
if (!c2.includes('const uniqueRecent = []')) {
  c2 = c2.replace(
    'const allRecent = [',
    'const rawRecent = ['
  );
  c2 = c2.replace(
    'const allClosing = [',
    'const uniqueRecent = [];\n    const seenRecentIds = new Set();\n    for (const item of rawRecent) {\n      if (!seenRecentIds.has(item.id)) {\n        seenRecentIds.add(item.id);\n        uniqueRecent.push(item);\n      }\n    }\n\n    const allClosing = ['
  );
  c2 = c2.replace(
    '<LatestUpdatesScroller recentItems={allRecent}',
    '<LatestUpdatesScroller recentItems={uniqueRecent}'
  );
  fs.writeFileSync(p2, c2);
  console.log("Patched page.tsx for UI deduplication");
}
