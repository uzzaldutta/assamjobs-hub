require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase.from('jobs').update({ status: 'PENDING' }).eq('id', 'scraped_1788619198585_0.04316654136717102');
  console.log('Update PENDING result:', { data, error });
  
  if (error) {
     const { data: d2, error: e2 } = await supabase.from('jobs').update({ status: 'DRAFT' }).eq('id', 'scraped_1788619198585_0.04316654136717102');
     console.log('Update DRAFT result:', { d2, e2 });
  }
}
run();
