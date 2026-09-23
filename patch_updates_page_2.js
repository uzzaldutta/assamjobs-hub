const fs = require('fs');
let p = 'src/app/updates/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "supabase.from('results').select('*').eq('status', 'PUBLISHED')",
  "supabase.from('jobs').select('*').eq('status', 'PUBLISHED').or('title.ilike.%result%,title.ilike.%merit list%')"
);

c = c.replace(
  "supabase.from('admit_cards').select('*').eq('status', 'PUBLISHED')",
  "supabase.from('jobs').select('*').eq('status', 'PUBLISHED').or('title.ilike.%admit card%,title.ilike.%hall ticket%')"
);

fs.writeFileSync(p, c);
console.log("Patched results and admit cards queries in updates page");
