const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAll() {
  console.log("--- PHASE 6.x LIVE DATABASE VERIFICATION ---");
  const results = {};

  const tables = [
    'ingestion_sources', 'ingestion_runs', 'ingestion_queue', 
    'job_provenance', 'jobs', 'tenders', 'admissions', 
    'results', 'admit_cards', 'scholarships'
  ];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`[FAIL] ${table}: ${error.message}`);
      results[table] = { status: 'FAIL', msg: error.message };
    } else {
      console.log(`[PASS] ${table} exists.`);
      results[table] = { status: 'PASS', msg: 'Exists' };
    }
  }
  
  // Check jobs count
  const { count: jobsCount, error: errJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
  if (errJobs) {
    console.log(`[FAIL] jobs count: ${errJobs.message}`);
  } else {
    console.log(`[PASS] jobs count: ${jobsCount} records preserved.`);
    results['jobs_count'] = { status: 'PASS', msg: `${jobsCount} records` };
  }
  
  // Check ingestion_runs specific columns
  const { data: ir, error: errIr } = await supabase.from('ingestion_runs').select('items_extracted, items_missing_link').limit(1);
  if (errIr) {
     console.log(`[FAIL] ingestion_runs columns: ${errIr.message}`);
     results['ingestion_runs_cols'] = { status: 'FAIL', msg: errIr.message };
  } else {
     console.log(`[PASS] ingestion_runs granular columns exist.`);
     results['ingestion_runs_cols'] = { status: 'PASS', msg: 'Columns exist' };
  }

  // Check RPC global_discovery_search
  const { data: rpc, error: errRpc } = await supabase.rpc('global_discovery_search', { search_query: 'test', limit_val: 1, offset_val: 0 });
  if (errRpc) {
     console.log(`[FAIL] RPC global_discovery_search: ${errRpc.message}`);
     results['rpc_global'] = { status: 'FAIL', msg: errRpc.message };
  } else {
     console.log(`[PASS] RPC global_discovery_search is operational.`);
     results['rpc_global'] = { status: 'PASS', msg: 'Working' };
  }

  console.log("JSON_RESULTS=" + JSON.stringify(results));
}

verifyAll();
