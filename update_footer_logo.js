const fs = require('fs');
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/logo\.png\?v=\d+/g, 'logo.png?v=7');
fs.writeFileSync('src/components/Footer.tsx', footer, 'utf8');
