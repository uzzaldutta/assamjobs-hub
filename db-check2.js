require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: jobs } = await supabase.from('jobs').select('job_type, category, application_end, status').limit(50);
  const types = [...new Set(jobs?.map(j => j.job_type))];
  const categories = [...new Set(jobs?.map(j => j.category))];
  
  console.log("Distinct Job Types:", types);
  console.log("Distinct Categories:", categories);
  
  // Check closing soon logic
  const now = new Date();
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  let active = 0, closingSoon = 0, closed = 0, nullDeadline = 0;
  for (const j of jobs || []) {
     if (!j.application_end) {
        nullDeadline++;
     } else {
        const d = new Date(j.application_end);
        if (d < now) closed++;
        else if (d <= nextWeek) closingSoon++;
        else active++;
     }
  }
  
  console.log(`Of 50 jobs: Active=${active}, ClosingSoon=${closingSoon}, Closed=${closed}, NullDeadline=${nullDeadline}`);
}
check();
