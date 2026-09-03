require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
console.log("Supabase URL:", url);

const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

async function check() {
  const tables = [
    'jobs', 'tenders', 'admissions', 'results', 'admit_cards', 'scholarships', 'ingestion_sources'
  ];
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`Error checking ${table}:`, error.message);
    } else {
      console.log(`Table ${table}: ${count} rows`);
    }
  }

  // Check unique statuses in jobs to see if we're filtering them out accidentally
  const { data: statuses } = await supabase.from('jobs').select('status').limit(20);
  const uniqueStatuses = [...new Set(statuses?.map(s => s.status))];
  console.log("Found statuses in jobs:", uniqueStatuses);
}
check();
