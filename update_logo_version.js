const fs = require('fs');
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace(/logo\.png\?v=\d+/g, 'logo.png?v=6');
fs.writeFileSync('src/app/layout.tsx', layout, 'utf8');

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/logo\.png\?v=\d+/g, 'logo.png?v=6');
fs.writeFileSync('src/components/Footer.tsx', footer, 'utf8');
