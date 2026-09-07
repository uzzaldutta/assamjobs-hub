const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sources = [
    {
      source_name: 'Employment Assam',
      base_url: 'https://employment.assam.gov.in',
      adapter_name: 'GenericAssamGovAdapter',
      tier: 1,
      is_official: true,
      feed_type: 'JOB',
      is_active: true,
      current_health: 'HEALTHY'
    },
    {
      source_name: 'NHM Assam',
      base_url: 'https://nhm.assam.gov.in',
      adapter_name: 'GenericAssamGovAdapter',
      tier: 1,
      is_official: true,
      feed_type: 'MULTIPLE',
      is_active: true,
      current_health: 'HEALTHY'
    }
  ];
  
  for (const src of sources) {
      const { data, error } = await supabase.from('ingestion_sources').insert([src]).select();
      if (error) console.error("Error inserting", src.source_name, error);
      else console.log("Inserted", src.source_name);
  }
}
run();
