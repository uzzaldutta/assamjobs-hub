const fs = require('fs');
const glob = require('glob');

// 1. Change revalidate to 600 (10 minutes) on list pages
const pages = [
  'src/app/page.tsx',
  'src/app/jobs/page.tsx',
  'src/app/updates/page.tsx',
  'src/app/results/page.tsx',
  'src/app/admissions/page.tsx',
  'src/app/admit-cards/page.tsx',
  'src/app/scholarships/page.tsx',
  'src/app/tenders/page.tsx',
  'src/app/railway-jobs/page.tsx',
  'src/app/govt-jobs/page.tsx',
  'src/app/private-jobs/page.tsx'
];

for (const p of pages) {
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/export const revalidate = \d+;/g, 'export const revalidate = 600;');
    fs.writeFileSync(p, c);
    console.log("Updated TTL for", p);
  }
}

// 2. Remove broad revalidatePath calls from all APIs and Actions
const apis = glob.sync('{src/app/api/**/*.ts,src/app/admin/studio/**/*.ts}');
for (const p of apis) {
  let c = fs.readFileSync(p, 'utf8');
  let original = c;
  
  // We want to remove revalidatePath('/') and similar broad ones, but keep template literals like `/jobs/${id}`
  const patternsToRemove = [
    /revalidatePath\('\/'\);/g,
    /revalidatePath\('\/jobs'\);/g,
    /revalidatePath\('\/admissions'\);/g,
    /revalidatePath\('\/admit-cards'\);/g,
    /revalidatePath\('\/scholarships'\);/g,
    /revalidatePath\('\/tenders'\);/g,
    /revalidatePath\('\/results'\);/g,
    /revalidatePath\('\/updates'\);/g
  ];
  
  for (const pat of patternsToRemove) {
    c = c.replace(pat, '// Removed broad revalidatePath in favor of Time-Based Revalidation (TTL)');
  }
  
  if (c !== original) {
    fs.writeFileSync(p, c);
    console.log("Cleaned revalidatePath in", p);
  }
}

