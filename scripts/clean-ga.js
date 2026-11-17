const fs = require('fs');

const paths = [
  'G:/assamjobs-hub_Oct24/src/app/layout.tsx',
  'E:/Uzzal/App Development/assamjobs-hub/src/app/layout.tsx'
];

for (const p of paths) {
  if (!fs.existsSync(p)) continue;
  let text = fs.readFileSync(p, 'utf8');
  // Remove the redundant inline Google Analytics block in <head>
  const regex = /\s*\{\/\* Google Analytics Setup \*\/\}[\s\S]*?\{process\.env\.NEXT_PUBLIC_GA_ID && \([\s\S]*?<\/>\s*\)\}/;
  if (regex.test(text)) {
    text = text.replace(regex, '');
    fs.writeFileSync(p, text, 'utf8');
    console.log(`Updated ${p}`);
  } else {
    console.log(`Pattern not matched in ${p}`);
  }
}
