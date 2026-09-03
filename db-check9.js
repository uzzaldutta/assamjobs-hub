require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: govtJobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'PUBLISHED')
    .eq('job_type', 'GOVERNMENT')
    .order('created_at', { ascending: false })
    .limit(6);
    
  console.log("Govt jobs error:", error?.message);
}
check();
