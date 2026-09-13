const fs = require('fs');

let pagePath = 'src/components/ScrollableJobFeed.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

content = content.replace(
    '<div className="flex overflow-x-auto snap-x snap-mandatory touch-pan-x gap-4 pb-6 hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:gap-5 md:pb-6">',
    '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 pb-6">'
);

content = content.replace(
    '<div key={job.id} className="w-[85vw] max-w-[340px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">',
    '<div key={job.id} className="w-full">'
);

fs.writeFileSync(pagePath, content);
console.log("Patched ScrollableJobFeed");
