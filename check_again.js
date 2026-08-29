const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function run() {
  const { data: jobs, error } = await supabase.from('jobs').select('title, vacancies, last_date').ilike('title', '%private sector%');
  if (error) { console.error(error); return; }
  console.log('Jobs with private sector:', jobs);
}
run();
