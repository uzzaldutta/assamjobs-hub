const fs = require('fs');

const files = [
  'src/app/api/generate-study-material/route.ts',
  'src/app/api/generate-mock-test/route.ts',
  'src/app/api/admin/fetch-url/route.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const modelsToTry = \[.*?\];/g, 'const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-pro"];');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed models in ' + file);
}
