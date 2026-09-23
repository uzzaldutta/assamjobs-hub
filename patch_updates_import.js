const fs = require('fs');
let p = 'src/app/updates/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  'import JobCard from "@/components/feeds/JobCard";',
  'import JobCard from "@/components/JobCard";'
);

fs.writeFileSync(p, c);
console.log("Fixed JobCard import");
