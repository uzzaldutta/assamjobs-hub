const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function check() {
  const { data, error } = await supabase.from('jobs').select('*').eq('id', 'manual_1788195168909').single();
  console.log("DATA:", data ? "EXISTS" : "NULL");
  console.log("ERROR:", error);
}
check();
