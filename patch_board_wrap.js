const fs = require('fs');
let p = 'src/components/ClassicUpdatesBoard.tsx';
let c = fs.readFileSync(p, 'utf8');

// Ensure text wraps properly
c = c.replace(/leading-normal text-slate-800/g, 'leading-normal text-slate-800 break-words whitespace-normal');

// Add border-box just in case
c = c.replace(/className="w-full bg-white/g, 'className="w-full box-border bg-white');

fs.writeFileSync(p, c);
console.log("Patched ClassicUpdatesBoard for text wrapping");
