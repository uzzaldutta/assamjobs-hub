const fs = require('fs');
const files = [
  'src/app/admissions/page.tsx',
  'src/app/admit-cards/page.tsx',
  'src/app/calendar/page.tsx',
  'src/app/govt-jobs/page.tsx',
  'src/app/private-jobs/page.tsx',
  'src/app/railway-jobs/page.tsx',
  'src/app/results/page.tsx',
  'src/app/study-materials/page.tsx',
  'src/app/tenders/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Check if it's already there
  if (!content.includes(".neq('category', 'BANNED_KEYWORD')")) {
    content = content.replace(/\.select\('\*'\)/g, ".select('*')\n      .neq('category', 'BANNED_KEYWORD')");
    // For calendar it might be select('id, title, ...')
    content = content.replace(/\.select\('id, title, organization, last_date, job_type, apply_url'\)/g, ".select('id, title, organization, last_date, job_type, apply_url')\n        .neq('category', 'BANNED_KEYWORD')");
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
