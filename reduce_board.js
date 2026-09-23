const fs = require('fs');
let p = 'src/components/ClassicUpdatesBoard.tsx';
let c = fs.readFileSync(p, 'utf8');

// Reduce items from 15 to 10
c = c.replace(/\.limit\(15\)/g, '.limit(10)');
c = c.replace(/\.slice\(0, 15\)/g, '.slice(0, 10)');

// Reduce height by decreasing padding
c = c.replace(/py-2\.5/g, 'py-1.5');
c = c.replace(/py-3/g, 'py-2'); // headers and buttons

// Reduce width of the entire board
c = c.replace(/className="w-full box-border/g, 'className="max-w-5xl mx-auto w-full box-border');

fs.writeFileSync(p, c);
console.log("Updated ClassicUpdatesBoard styling");
