const fs = require('fs');
let p = 'src/components/ClassicUpdatesBoard.tsx';
let c = fs.readFileSync(p, 'utf8');

// Ensure min-w-0 on grid columns
c = c.replace(/className="flex flex-col"/g, 'className="flex flex-col min-w-0 w-full"');

// Ensure min-w-0 on li
c = c.replace(/<li key={`latest-\${item.id}`} className="/g, '<li key={`latest-${item.id}`} className="min-w-0 w-full overflow-hidden ');
c = c.replace(/<li key={`job-\${item.id}`} className="/g, '<li key={`job-${item.id}`} className="min-w-0 w-full overflow-hidden ');

// Ensure Link wraps properly and doesn't push width
c = c.replace(/<Link href=\{item.url\} className="block/g, '<Link href={item.url} className="block w-full break-words whitespace-normal');
c = c.replace(/<Link href=\{`\/jobs\/\$\{item.id\}`} className="block/g, '<Link href={`/jobs/${item.id}`} className="block w-full break-words whitespace-normal');

fs.writeFileSync(p, c);
console.log("Patched ClassicUpdatesBoard for strict overflow containment");
