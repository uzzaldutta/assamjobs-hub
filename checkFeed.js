require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: rJobs, error } = await supabase.from('jobs').select('id, title, organization, job_type, last_date, created_at, scraped_at').eq('status', 'PUBLISHED').order('scraped_at', { ascending: false }).limit(6);
  
  console.log('Error:', error);
  console.log('rJobs:', rJobs?.length || 0);
  
  if (rJobs?.length > 0) {
      console.log('First job:', rJobs[0]);
  }
}
run();
