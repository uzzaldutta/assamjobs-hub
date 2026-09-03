const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function verifyMonitoring() {
  console.log("--- FEED MONITORING LIVE VERIFICATION ---");
  
  // 1. Check new columns in ingestion_sources
  const { data: sources, error: sourceErr } = await supabase
    .from('ingestion_sources')
    .select('current_health, consecutive_failures, last_successful_run, last_failed_run, last_error')
    .limit(1);
    
  if (sourceErr) {
    console.log(`[FAIL] ingestion_sources columns missing: ${sourceErr.message}`);
  } else {
    console.log(`[PASS] ingestion_sources health tracking columns verified.`);
  }
  
  // 2. Check ingestion_daily_summaries view
  const { data: view, error: viewErr } = await supabase
    .from('ingestion_daily_summaries')
    .select('*')
    .limit(1);
    
  if (viewErr) {
    console.log(`[FAIL] ingestion_daily_summaries view missing/invalid: ${viewErr.message}`);
  } else {
    console.log(`[PASS] ingestion_daily_summaries view verified and operational.`);
  }
}

verifyMonitoring();
