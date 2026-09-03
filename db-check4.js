require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data: jobs, error } = await supabase.from('jobs').select('job_type, category, application_end, status').limit(50);
  console.log("Error:", error);
  console.log("Jobs length:", jobs?.length);
  
  if (jobs && jobs.length > 0) {
     console.log("job_type:", jobs[0].job_type);
  }
}
check();
