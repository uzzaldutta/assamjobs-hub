const fs = require('fs');
let p = 'src/app/sitemap.ts';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "select('id, scraped_at')",
  "select('id, slug, scraped_at')"
);

c = c.replace(
  "url: `${baseUrl}/jobs/${job.id}`",
  "url: `${baseUrl}/jobs/${job.slug || job.id}`"
);

fs.writeFileSync(p, c);
console.log("Patched sitemap");
