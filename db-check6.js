require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: jobs, error } = await supabase.from('jobs').select('*').limit(2);
  console.log("Error:", error);
  console.log("Jobs row 1:", jobs[0]);
}
check();
