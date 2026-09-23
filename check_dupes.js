const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findDupes() {
  console.log("Fetching jobs...");
  let allJobs = [];
  let page = 0;
  while(true) {
    const { data, error } = await supabase.from('jobs').select('id, title, organization, status').range(page*1000, (page+1)*1000 - 1);
    if (error) { console.error(error); break; }
    if (!data || data.length === 0) break;
    allJobs = allJobs.concat(data);
    page++;
  }
  
  console.log(`Total jobs fetched: ${allJobs.length}`);
  
  const map = new Map();
  let duplicates = [];
  
  for (const job of allJobs) {
    if (job.status !== 'PUBLISHED') continue;
    
    // Normalize string to match duplicates
    const key = `${(job.title || '').toLowerCase().trim()}|${(job.organization || '').toLowerCase().trim()}`;
    
    if (map.has(key)) {
      duplicates.push({ keep: map.get(key), delete: job });
    } else {
      map.set(key, job);
    }
  }
  
  console.log(`Found ${duplicates.length} duplicate PUBLISHED jobs based on title and organization.`);
}

findDupes();
