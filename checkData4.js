require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: jobs } = await supabase.from('jobs').select('id, title, status, organization').eq('id', 'scraped_1788619198585_0.04316654136717102');
  console.log('jobs:', jobs);
}
run();
