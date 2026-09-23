const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function check() {
  const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).is('slug', null);
  console.log("Jobs missing slug:", count);
}
check();
