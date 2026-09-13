const fs = require('fs');

let layoutPath = 'src/app/layout.tsx';
let content = fs.readFileSync(layoutPath, 'utf8');

// 1. Add import
if (!content.includes('HeaderScrollTracker')) {
    content = content.replace(
        'import AdBanner from "@/components/AdBanner";',
        'import AdBanner from "@/components/AdBanner";\nimport HeaderScrollTracker from "@/components/HeaderScrollTracker";'
    );
}

// 2. Add id="main-header"
content = content.replace(
    '<header className="sticky top-0 z-50 glass',
    '<header id="main-header" className="sticky top-0 z-50 glass transition-all duration-300'
);

// 3. Add id="header-inner" and transitions
content = content.replace(
    '<div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-between items-center h-16 md:h-20">',
    '<div id="header-inner" className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-between items-center h-16 md:h-20 transition-all duration-300 ease-in-out">'
);

// 4. Add id="header-logo" and transitions
content = content.replace(
    '<img src="/logo.png?v=6" alt="AssamJobs Hub Logo" className="hidden md:block h-20 w-auto object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180" />',
    '<img id="header-logo" src="/logo.png?v=6" alt="AssamJobs Hub Logo" className="hidden md:block h-20 w-auto object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180 transition-all duration-300 ease-in-out" />'
);

// 5. Add <HeaderScrollTracker /> inside body
if (!content.includes('<HeaderScrollTracker />')) {
    content = content.replace(
        '</ThemeProvider>',
        '  <HeaderScrollTracker />\n        </ThemeProvider>'
    );
}

fs.writeFileSync(layoutPath, content);
console.log("Patched layout.tsx");
