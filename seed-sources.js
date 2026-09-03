const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const sources = [
  // TIER 1 - OFFICIAL
  { source_name: 'APSC', base_url: 'https://apsc.nic.in', adapter_name: 'APSCAdapter', tier: 1, is_official: true, feed_type: 'JOB' },
  { source_name: 'DHS Assam', base_url: 'https://dhs.assam.gov.in', adapter_name: 'GenericAssamGovAdapter', tier: 1, is_official: true, feed_type: 'JOB' },
  { source_name: 'SEBA', base_url: 'https://sebaonline.org', adapter_name: 'GenericEducationAdapter', tier: 1, is_official: true, feed_type: 'MULTIPLE' },
  { source_name: 'AHSEC', base_url: 'https://ahsec.assam.gov.in', adapter_name: 'GenericEducationAdapter', tier: 1, is_official: true, feed_type: 'MULTIPLE' },
  { source_name: 'Assam Police', base_url: 'https://slprbassam.in', adapter_name: 'GenericAssamGovAdapter', tier: 1, is_official: true, feed_type: 'JOB' },
  { source_name: 'Assam University', base_url: 'http://www.aus.ac.in', adapter_name: 'GenericEducationAdapter', tier: 1, is_official: true, feed_type: 'ADMISSION' },
  { source_name: 'Gauhati University', base_url: 'https://gauhati.ac.in', adapter_name: 'GenericEducationAdapter', tier: 1, is_official: true, feed_type: 'MULTIPLE' },
  { source_name: 'Dibrugarh University', base_url: 'https://dibru.ac.in', adapter_name: 'GenericEducationAdapter', tier: 1, is_official: true, feed_type: 'MULTIPLE' },

  // TIER 2 - DISCOVERY
  { source_name: 'JobAssam', base_url: 'https://jobassam.in', adapter_name: 'JobAssamAdapter', tier: 2, is_official: false, feed_type: 'MULTIPLE' },
  { source_name: 'AssamCareer', base_url: 'https://assamcareer.com', adapter_name: 'AssamCareerAdapter', tier: 2, is_official: false, feed_type: 'MULTIPLE' },
  { source_name: 'AssamJob', base_url: 'https://assamjob.in', adapter_name: 'GenericDiscoveryAdapter', tier: 2, is_official: false, feed_type: 'MULTIPLE' }
];

async function seedSources() {
  for (const s of sources) {
    const { data: existing } = await supabase.from('ingestion_sources').select('id').eq('source_name', s.source_name).single();
    if (existing) {
       await supabase.from('ingestion_sources').update(s).eq('id', existing.id);
    } else {
       await supabase.from('ingestion_sources').insert(s);
    }
  }
  console.log("Sources seeded successfully.");
}

seedSources();
