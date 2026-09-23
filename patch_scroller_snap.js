const fs = require('fs');

let pagePath = 'src/components/LatestUpdatesScroller.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// Remove snap classes from container
content = content.replace(
    'className="flex overflow-x-auto gap-3 sm:gap-4 pb-6 px-4 snap-x snap-mandatory custom-scrollbar relative"',
    'className="flex overflow-x-auto gap-3 sm:gap-4 pb-6 px-4 custom-scrollbar relative"'
);

// Remove snap-start from child
content = content.replace(
    'border snap-start transition-transform',
    'border transition-transform'
);

fs.writeFileSync(pagePath, content);
console.log("Patched LatestUpdatesScroller snapping");
