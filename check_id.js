const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function checkId() {
  const { data, error } = await supabase.from('jobs').select('id, title').limit(3);
  if (error) { console.error(error); return; }
  console.log("Sample IDs:", data.map(d => d.id));
}
checkId();
