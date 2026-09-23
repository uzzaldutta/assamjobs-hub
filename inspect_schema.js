const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function inspectSchema() {
  const { data, error } = await supabase.from('jobs').select('*').limit(1);
  if (error) { console.error(error); return; }
  if (data && data.length > 0) {
    console.log("Job Schema Keys:", Object.keys(data[0]));
  }
}
inspectSchema();
