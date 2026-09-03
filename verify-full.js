const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function verifyAll() {
  console.log("--- FULL FEED MONITORING LIVE VERIFICATION ---");
  const results = {};

  // 1. Health tracking columns & ingestion_sources
  const { data: s, error: sErr } = await supabase.from('ingestion_sources').select('current_health, consecutive_failures, last_successful_run, last_failed_run, last_error').limit(1);
  results['ingestion_sources'] = sErr ? `FAIL: ${sErr.message}` : 'PASS';

  // 2. Granular tracking on ingestion_runs
  const { data: r, error: rErr } = await supabase.from('ingestion_runs').select('items_extracted, items_new, items_duplicate, items_changed, items_missing_link').limit(1);
  results['ingestion_runs'] = rErr ? `FAIL: ${rErr.message}` : 'PASS';

  // 3. ingestion_daily_summaries view
  const { data: v, error: vErr } = await supabase.from('ingestion_daily_summaries').select('*').limit(1);
  results['ingestion_daily_summaries'] = vErr ? `FAIL: ${vErr.message}` : 'PASS';

  // 4. Existing data preservation
  const { count: jCount, error: jErr } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
  results['jobs_intact'] = (jErr || jCount !== 145) ? `FAIL: Count mismatch or error (${jCount})` : 'PASS';

  // 5. Global Search RPC
  const { data: rpc, error: rpcErr } = await supabase.rpc('global_discovery_search', { search_query: 'assam', limit_val: 1, offset_val: 0 });
  results['global_search'] = rpcErr ? `FAIL: ${rpcErr.message}` : 'PASS';

  console.log(JSON.stringify(results, null, 2));
}

verifyAll();
