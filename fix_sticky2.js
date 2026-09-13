const fs = require('fs');

let layoutPath = 'src/app/layout.tsx';
let content = fs.readFileSync(layoutPath, 'utf8');

// Revert body
content = content.replace(
    '<body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-x-hidden">',
    '<body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">'
);

// Put overflow-clip on div instead of overflow-hidden
content = content.replace(
    '<div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative">',
    '<div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative overflow-clip">'
);

fs.writeFileSync(layoutPath, content);
console.log("Fixed sticky context 2");
