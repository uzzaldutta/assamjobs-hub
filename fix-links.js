const fs = require('fs');

const files = [
  'src/app/layout.tsx',
  'src/components/Footer.tsx',
  'src/components/MobileMenu.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\/tools\/interview-coach/g, '/tools/interview-prep');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed ' + file);
}
