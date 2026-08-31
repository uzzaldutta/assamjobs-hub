const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function testDelete() {
  const { error } = await supabase.from('jobs').delete().eq('id', 'scraped_1788198848942_0.7510357057209707');
  console.log("Delete Error:", error);
}
testDelete();
