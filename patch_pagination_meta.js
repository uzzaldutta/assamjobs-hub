const fs = require('fs');
let p = 'src/app/jobs/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "const hasFilters = searchParams && Object.keys(searchParams).length > 0 && !(Object.keys(searchParams).length === 1 && searchParams.page);",
  "const hasFilters = searchParams && Object.keys(searchParams).some(k => k !== 'page');"
);

c = c.replace(
  "canonical: \"/jobs\",",
  "canonical: searchParams?.page && searchParams.page !== '1' ? `/jobs?page=${searchParams.page}` : \"/jobs\","
);

c = c.replace(
  "index: !hasFilters,",
  "index: !hasFilters, // allow indexing pagination, but not arbitrary filters"
);

fs.writeFileSync(p, c);
console.log("Updated pagination SEO control");
