const fs = require('fs');
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

// Replace the logo block
const oldLogoBlock = `                      {/* Full Logo for Desktop */}
                      <img src="/logo.png?v=6" alt="AssamJobs Hub Logo" className="hidden md:block h-20 w-auto object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180" />
                      {/* Compact Logo for Mobile */}
                      <img src="/icon-192.png" alt="AssamJobs Hub Compact Logo" className="block md:hidden h-10 w-auto object-contain drop-shadow-sm rounded-lg" />`;

const newLogoBlock = `                      {/* Responsive Logo */}
                      <img src="/logo.png?v=7" alt="AssamJobs Hub Logo" className="h-10 md:h-16 lg:h-20 w-auto object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180" />`;

if (layout.includes('icon-192.png')) {
    // Regex or simple split/replace
    layout = layout.replace(oldLogoBlock, newLogoBlock);
    fs.writeFileSync('src/app/layout.tsx', layout, 'utf8');
    console.log("Updated layout.tsx logo block");
} else {
    console.log("Could not find the exact old logo block");
}
