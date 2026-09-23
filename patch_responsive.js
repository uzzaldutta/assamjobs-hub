const fs = require('fs');
let p = 'src/components/ClassicUpdatesBoard.tsx';
let c = fs.readFileSync(p, 'utf8');

// Update grid and divide to md: instead of lg:
c = c.replace('grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x', 'grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x');

// Update max height for better mobile viewing
c = c.replace(/max-h-\[450px\]/g, 'max-h-[380px] md:max-h-[480px]');

// Fix text sizing and padding slightly for better fit
c = c.replace(/text-sm/g, 'text-[13px] md:text-sm leading-tight md:leading-normal');

// Add a slight hover background to list items for better touch target visibility
c = c.replace(/block py-3 px-1/g, 'block py-3 px-2 md:px-3 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-md my-0.5');

fs.writeFileSync(p, c);
console.log("Patched ClassicUpdatesBoard for responsive optimization");
