require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: govtJobs, error: err1 } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'PUBLISHED')
    .eq('job_type', 'GOVERNMENT')
    .order('scraped_at', { ascending: false })
    .limit(6);
  
  const { data: closingSoonJobs, error: err2 } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'PUBLISHED')
    .gte('last_date', new Date().toISOString())
    .lte('last_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('last_date', { ascending: true })
    .limit(6);
    
  console.log("Govt jobs:", govtJobs?.length, err1?.message);
  console.log("Closing soon jobs:", closingSoonJobs?.length, err2?.message);
}
check();
