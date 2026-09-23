const fs = require('fs');

// Fix 1: src/app/jobs/page.tsx
let p1 = 'src/app/jobs/page.tsx';
let c1 = fs.readFileSync(p1, 'utf8');
// It currently has:
// export async function generateMetadata...
// // export const metadata = {
//   title: "Jobs in Assam",
//   description: ...
//   alternates: ...
// };
// I will just remove the dangling old metadata object properties.
c1 = c1.replace(/\/\/ export const metadata = \{[\s\S]*?\};\n/, '');
fs.writeFileSync(p1, c1);

// Fix 2: src/app/api/jobs/sync/route.ts
let p2 = 'src/app/api/jobs/sync/route.ts';
let c2 = fs.readFileSync(p2, 'utf8');
c2 = c2.replace(/slug: await generateUniqueSlug\(job\.title\), 6\),/g, 'slug: await generateUniqueSlug(job.title),');
fs.writeFileSync(p2, c2);

// Let's also check scrape-nfr just in case
let p2b = 'src/app/api/jobs/scrape-nfr/route.ts';
let c2b = fs.readFileSync(p2b, 'utf8');
c2b = c2b.replace(/slug: await generateUniqueSlug\(job\.title\), 6\),/g, 'slug: await generateUniqueSlug(job.title),');
fs.writeFileSync(p2b, c2b);

console.log("Fixed page.tsx and routes.");
