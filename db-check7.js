require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: jobs, error } = await supabase.from('jobs').select('job_type');
  const counts = {};
  for(let j of jobs||[]) {
    counts[j.job_type] = (counts[j.job_type]||0) + 1;
  }
  console.log("Job type counts:", counts);
}
check();
