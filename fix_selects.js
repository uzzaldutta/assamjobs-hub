const fs = require('fs');

function addSlugToSelect(file) {
  let c = fs.readFileSync(file, 'utf8');
  
  // Replace all instances of `supabase.from('jobs').select('id, ` with `supabase.from('jobs').select('id, slug, `
  c = c.replace(/from\('jobs'\)\.select\('id, /g, "from('jobs').select('id, slug, ");
  
  // also handle standard multiline
  c = c.replace(/\.select\('id, title,/g, ".select('id, slug, title,");

  // fix search/SearchClient.tsx
  c = c.replace(/select\('id, title, organization, last_date, scraped_at, job_type, apply_url, official_pdf_url'\)/g, "select('id, slug, title, organization, last_date, scraped_at, job_type, apply_url, official_pdf_url')");

  fs.writeFileSync(file, c);
  console.log(`Added slug to selects in ${file}`);
}

const files = [
  'src/app/page.tsx',
  'src/app/jobs/page.tsx',
  'src/components/ClassicUpdatesBoard.tsx',
  'src/app/updates/page.tsx',
  'src/app/search/SearchClient.tsx',
  'src/components/ScrollableJobFeed.tsx',
  'src/components/FeedList.tsx'
];

files.forEach(addSlugToSelect);
