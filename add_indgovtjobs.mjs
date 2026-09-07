import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function addSource() {
  const { data, error } = await supabase.from('ingestion_sources').insert({
      source_name: 'IndGovtJobs',
      base_url: 'https://assam.indgovtjobs.net/category/railway-jobs/',
      adapter_name: 'IndGovtJobsAdapter',
      is_official: false,
      tier: 2,
      feed_type: 'MULTIPLE',
      is_active: true
  });
  if (error) console.error("DB Error:", error.message);
  else console.log("Successfully added IndGovtJobs source.");
}
addSource();
