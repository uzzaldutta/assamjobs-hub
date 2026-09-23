const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function backfillSlugs() {
  const { data: jobs, error } = await supabase.from('jobs').select('id, title, organization').is('slug', null);
  if (!jobs) return;
  
  const existingSlugs = new Set();
  
  console.log("Updating individually...");
  
  let promises = [];
  
  for (let job of jobs) {
    if (!job.title) continue;
    let base = job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    let finalSlug = base;
    let counter = 2;
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${base}-${counter}`;
      counter++;
    }
    existingSlugs.add(finalSlug);
    
    promises.push(
      supabase.from('jobs').update({ slug: finalSlug }).eq('id', job.id)
    );
    
    // Batch to avoid rate limits
    if (promises.length === 50) {
      await Promise.all(promises);
      promises = [];
    }
  }
  if (promises.length > 0) await Promise.all(promises);
  
  console.log("Slug backfill complete.");
}

backfillSlugs();
