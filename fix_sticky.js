const fs = require('fs');

let layoutPath = 'src/app/layout.tsx';
let content = fs.readFileSync(layoutPath, 'utf8');

// 1. Add overflow-x-hidden to body
content = content.replace(
    '<body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">',
    '<body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-x-hidden">'
);

// 2. Remove overflow-hidden from the wrapper div
content = content.replace(
    '<div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative overflow-hidden">',
    '<div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative">'
);

fs.writeFileSync(layoutPath, content);
console.log("Fixed sticky context");
