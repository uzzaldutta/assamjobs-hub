const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("--- PHASE 6.x DATABASE VERIFICATION ---");
  
  // 1. Verify admit_cards exists
  const { data: ac, error: errAc } = await supabase.from('admit_cards').select('id').limit(1);
  if (errAc) console.error("FAIL: admit_cards table issue ->", errAc.message);
  else console.log("PASS: admit_cards table exists.");

  // 2. Verify scholarships exists
  const { data: sc, error: errSc } = await supabase.from('scholarships').select('id').limit(1);
  if (errSc) console.error("FAIL: scholarships table issue ->", errSc.message);
  else console.log("PASS: scholarships table exists.");

  // 3. Verify ingestion_runs columns
  const { data: ir, error: errIr } = await supabase.from('ingestion_runs').select('items_extracted, items_missing_link').limit(1);
  if (errIr) console.error("FAIL: ingestion_runs missing new columns ->", errIr.message);
  else console.log("PASS: ingestion_runs has granular monitoring columns.");

  // 4. Verify RPC
  const { data: rpc, error: errRpc } = await supabase.rpc('global_discovery_search', { search_query: 'test', limit_val: 1, offset_val: 0 });
  if (errRpc) console.error("FAIL: global_discovery_search RPC issue ->", errRpc.message);
  else console.log("PASS: global_discovery_search RPC is operational and callable.");

  // 5. Verify existing jobs data
  const { data: jobs, error: errJobs } = await supabase.from('jobs').select('id', { count: 'exact' });
  if (errJobs) console.error("FAIL: jobs table issue ->", errJobs.message);
  else console.log(`PASS: jobs table intact (Found ${jobs.length} records).`);

}

verify();
