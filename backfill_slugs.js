const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function backfillSlugs() {
  console.log("Fetching all jobs without slugs...");
  
  // We fetch everything since we need to assign slugs
  const { data: jobs, error } = await supabase.from('jobs').select('id, title, organization').is('slug', null);
  
  if (error) { console.error("Error fetching jobs:", error); return; }
  if (!jobs || jobs.length === 0) { console.log("No jobs need slugs."); return; }
  
  console.log(`Found ${jobs.length} jobs to update.`);
  
  const existingSlugs = new Set();
  // We should also fetch existing slugs just in case some were manually added
  const { data: existing } = await supabase.from('jobs').select('slug').not('slug', 'is', null);
  if (existing) existing.forEach(e => existingSlugs.add(e.slug));

  let batch = [];
  
  for (let job of jobs) {
    if (!job.title) continue;
    
    // Create base slug
    let base = job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Ensure uniqueness
    let finalSlug = base;
    let counter = 2;
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${base}-${counter}`;
      counter++;
    }
    existingSlugs.add(finalSlug);
    
    batch.push({ id: job.id, slug: finalSlug });
  }
  
  console.log("Updating jobs in batches...");
  // Update in batches of 50
  for (let i = 0; i < batch.length; i += 50) {
    const chunk = batch.slice(i, i + 50);
    // Supabase upsert can handle updates if we provide the primary key 'id'
    const { error: updateError } = await supabase.from('jobs').upsert(chunk);
    if (updateError) {
      console.error(`Error updating batch ${i}:`, updateError);
    }
  }
  console.log("Slug backfill complete.");
}

backfillSlugs();
