require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: results, error } = await supabase.rpc('global_discovery_search', { search_query: 'Assam' });
  console.log("RPC Error:", error);
  console.log("RPC Results length:", results?.length);
}
check();
