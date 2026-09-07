const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: nhm, error: nhmErr } = await supabase.from('ingestion_sources')
    .update({ adapter_name: 'NHMAssamAdapter' })
    .eq('source_name', 'NHM Assam')
    .select();
  if (nhmErr) console.error("NHM error:", nhmErr);
  else console.log("Updated NHM Assam:", nhm[0].adapter_name);

  const { data: emp, error: empErr } = await supabase.from('ingestion_sources')
    .update({ is_active: false })
    .eq('source_name', 'Employment Assam')
    .select();
  if (empErr) console.error("Emp error:", empErr);
  else console.log("Disabled Employment Assam");
}
run();
