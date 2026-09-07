require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  console.log('\n--- Searching for specific job in jobs ---');
  let { data: jobs } = await supabase.from('jobs').select('id, title, status, organization').ilike('title', '%Assam Job Alert%');
  console.log('jobs:', jobs);
  
  console.log('\n--- Searching in ingestion_queue ---');
  let { data: queue } = await supabase.from('ingestion_queue').select('id, source_url, status, extracted_data').ilike('extracted_data->>title', '%Assam Job Alert%');
  console.log('queue:', queue?.map(q => ({id: q.id, status: q.status, url: q.source_url})));
}
run();
