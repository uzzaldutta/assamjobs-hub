const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function testSpam() {
  const { data } = await supabase
    .from('jobs')
    .select('id, title')
    .neq('category', 'BANNED_KEYWORD')
    .order('scraped_at', { ascending: false })
    .limit(20);
    
  console.log("Recent Jobs:");
  data.forEach(d => console.log(d.id, " | ", d.title));
}
testSpam();
