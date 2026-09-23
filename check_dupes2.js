const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findUrlDupes() {
  console.log("Fetching jobs...");
  let allJobs = [];
  let page = 0;
  while(true) {
    const { data, error } = await supabase.from('jobs').select('id, title, apply_url, status').range(page*1000, (page+1)*1000 - 1);
    if (error) { console.error(error); break; }
    if (!data || data.length === 0) break;
    allJobs = allJobs.concat(data);
    page++;
  }
  
  const map = new Map();
  let duplicates = [];
  
  for (const job of allJobs) {
    if (job.status !== 'PUBLISHED' || !job.apply_url || job.apply_url.length < 10) continue;
    
    const key = job.apply_url.trim();
    
    if (map.has(key)) {
      duplicates.push({ keep: map.get(key), delete: job });
    } else {
      map.set(key, job);
    }
  }
  
  console.log(`Found ${duplicates.length} duplicate PUBLISHED jobs based on apply_url.`);
}

findUrlDupes();
