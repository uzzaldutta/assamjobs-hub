const fs = require('fs');

function patch(file) {
  let c = fs.readFileSync(file, 'utf8');
  
  // Add import
  if (!c.includes('generateUniqueSlug')) {
    c = c.replace(
      "import { supabase } from '@/lib/supabase';",
      "import { supabase } from '@/lib/supabase';\nimport { generateUniqueSlug } from '@/lib/slugify';"
    );
  }
  
  // Remove Math.random logic and await generateUniqueSlug
  // The line was: slug: job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6),
  c = c.replace(
    /slug: job\.title\.toLowerCase\(\).*?Math\.random\(\).*?,/g,
    "slug: await generateUniqueSlug(job.title),"
  );
  
  fs.writeFileSync(file, c);
  console.log(`Patched ${file}`);
}

patch('src/app/api/jobs/sync/route.ts');
patch('src/app/api/jobs/scrape-nfr/route.ts');
