const fs = require('fs');

function patch(file) {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('slug:')) {
    c = c.replace(
      "title: job.title,",
      "title: job.title,\n            slug: job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6),"
    );
    fs.writeFileSync(file, c);
    console.log(`Patched ${file}`);
  }
}
patch('src/app/api/jobs/sync/route.ts');
patch('src/app/api/jobs/scrape-nfr/route.ts');
