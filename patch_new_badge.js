const fs = require('fs');

let p = 'src/components/ClassicUpdatesBoard.tsx';
let c = fs.readFileSync(p, 'utf8');

// We need to inject the index into the map function and add the New badge

// For latestUpdates
c = c.replace(
  '{latestUpdates.map(item => (', 
  '{latestUpdates.map((item, index) => ('
);
c = c.replace(
  '<Link href={item.url} className="block py-3 px-1 text-sm text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">\n                    {item.title}\n                  </Link>',
  '<Link href={item.url} className="block py-3 px-1 text-sm text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">\n                    {item.title}\n                    {index < 5 && <span className="ml-2 inline-block px-1.5 py-[1px] text-[10px] font-black bg-red-500 text-white rounded animate-pulse tracking-wide align-middle">NEW</span>}\n                  </Link>'
);

// For jobUpdates
c = c.replace(
  '{jobUpdates.map(item => (', 
  '{jobUpdates.map((item, index) => ('
);
c = c.replace(
  '<Link href={`/jobs/${item.id}`} className="block py-3 px-1 text-sm text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">\n                    {item.title}\n                  </Link>',
  '<Link href={`/jobs/${item.id}`} className="block py-3 px-1 text-sm text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">\n                    {item.title}\n                    {index < 5 && <span className="ml-2 inline-block px-1.5 py-[1px] text-[10px] font-black bg-red-500 text-white rounded animate-pulse tracking-wide align-middle">NEW</span>}\n                  </Link>'
);

fs.writeFileSync(p, c);
console.log("Patched ClassicUpdatesBoard with flashing New badges");
