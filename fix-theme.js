const fs = require('fs');

const files = [
  'src/app/study-materials/[materialId]/page.tsx',
  'src/app/study-materials/ai-generator/page.tsx',
  'src/app/study-materials/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/theme="indigo"/g, 'theme="blue"');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed ' + file);
}
