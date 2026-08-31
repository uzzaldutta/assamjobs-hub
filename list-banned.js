const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function testSpam() {
  const { data } = await supabase
    .from('jobs')
    .select('title')
    .eq('category', 'BANNED_KEYWORD');
    
  console.log("Banned Keywords:");
  data.forEach(d => console.log(d.title));
}
testSpam();
