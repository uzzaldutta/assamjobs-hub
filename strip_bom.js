const fs = require('fs');
let content = fs.readFileSync('vercel.json', 'utf8');
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}
fs.writeFileSync('vercel.json', content, 'utf8');
console.log("Stripped BOM");
