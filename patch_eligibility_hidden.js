const fs = require('fs');
let pagePath = 'src/app/jobs/[id]/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

content = content.replace('<div className="my-6 lg:hidden">', '<div className="my-6">');
fs.writeFileSync(pagePath, content);
console.log("Removed lg:hidden");
