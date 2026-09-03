require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: jobs } = await supabase.from('jobs').select('job_type, type, category, application_end, status').limit(50);
  const job_types = [...new Set(jobs?.map(j => j.job_type))];
  const types = [...new Set(jobs?.map(j => j.type))];
  const categories = [...new Set(jobs?.map(j => j.category))];
  
  console.log("Distinct job_types:", job_types);
  console.log("Distinct types:", types);
  console.log("Distinct categories:", categories);
}
check();
