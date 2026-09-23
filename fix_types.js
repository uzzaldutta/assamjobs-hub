const fs = require('fs');
let p = 'src/lib/search/searchTypes.ts';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "export interface SearchResultItem {",
  "export interface SearchResultItem {\n  slug?: string;"
);

fs.writeFileSync(p, c);
console.log("Patched searchTypes.ts");
