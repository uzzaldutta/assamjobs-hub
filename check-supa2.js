const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function check() {
  const { data, error } = await supabase.from('jobs').select('title, category, job_type, created_at').order('created_at', { ascending: false }).limit(5);
  console.log("DATA:", data);
  console.log("ERROR:", error);
}
check();
