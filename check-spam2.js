const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function checkSpam() {
  const { data } = await supabase
    .from('jobs')
    .select('title')
    .neq('category', 'BANNED_KEYWORD');
  
  let spam = data.filter(d => d.title.toLowerCase().includes('learn with spk') || d.title.toLowerCase().includes('calculator') || d.title.toLowerCase().includes('combiner') || d.title.toLowerCase().includes('bio-data'));
  console.log(spam);
}
checkSpam();
