const fs = require('fs');
const content = fs.readFileSync('src/app/admissions/page.tsx', 'utf8');
const lines = content.split('\n').filter(l => l.includes('supabase.from'));
console.log(lines);
