require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: govtJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'PUBLISHED')
    .eq('job_type', 'GOVERNMENT')
    .order('created_at', { ascending: false })
    .limit(6);
    
  console.log("Govt jobs:", govtJobs?.length);

  const { data: closingSoonJobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'PUBLISHED')
    .gte('application_end', new Date().toISOString())
    .lte('application_end', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('application_end', { ascending: true })
    .limit(6);
    
  console.log("Closing soon jobs error:", error?.message);
}
check();
