const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanFuzzyDupes() {
  console.log("Fetching jobs for fuzzy deduplication...");
  let allJobs = [];
  let page = 0;
  while(true) {
    const { data, error } = await supabase.from('jobs').select('id, title, organization, scraped_at, apply_url').range(page*1000, (page+1)*1000 - 1);
    if (error) { console.error(error); break; }
    if (!data || data.length === 0) break;
    allJobs = allJobs.concat(data);
    page++;
  }
  
  console.log(`Fetched ${allJobs.length} jobs.`);
  
  // Sort by scraped_at DESC so we keep the newest one
  allJobs.sort((a, b) => new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime());
  
  const map = new Map();
  const idsToDelete = [];
  
  for (const job of allJobs) {
    if (!job.title || !job.organization) continue;
    
    // Normalize: lowercase, remove punctuation, extract first 5 words
    let cleanTitle = job.title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    let words = cleanTitle.split(' ');
    let fuzzyPrefix = words.slice(0, 6).join(' '); // first 6 words
    
    const key = `${fuzzyPrefix}|${job.organization.toLowerCase().trim()}`;
    
    if (map.has(key)) {
      // It's a duplicate of a newer post
      idsToDelete.push(job.id);
    } else {
      map.set(key, job.id);
    }
  }
  
  console.log(`Found ${idsToDelete.length} fuzzy duplicates.`);
  
  // Delete them in batches
  for (let i = 0; i < idsToDelete.length; i += 50) {
    const batch = idsToDelete.slice(i, i + 50);
    const { error } = await supabase.from('jobs').delete().in('id', batch);
    if (error) console.error("Error deleting batch", error);
    else console.log(`Deleted batch of ${batch.length}`);
  }
  
  console.log("Fuzzy deduplication complete.");
}

cleanFuzzyDupes();
