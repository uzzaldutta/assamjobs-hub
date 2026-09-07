require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const tables = ['results', 'admit_cards', 'admissions', 'scholarships', 'tenders'];
  for (const table of tables) {
    const { count: total } = await supabase.from(table).select('*', { count: 'exact', head: true });
    const { count: pubCount } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED');
    console.log(table, 'Total:', total, 'Published:', pubCount);
  }
  
  console.log('\n--- Searching for specific job ---');
  const { data: jobs } = await supabase.from('jobs').select('id, title, status, job_type, organization, duplicate_of').ilike('title', '%Assam Job Alert%');
  console.log(jobs);
}
run();
