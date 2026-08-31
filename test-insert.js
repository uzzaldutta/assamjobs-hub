const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function fixSpam() {
  const { error } = await supabase.from('jobs').insert({
    id: `banned_${Date.now()}_xyz`,
    title: 'learn with spk',
    organization: 'SYSTEM',
    job_type: 'PRIVATE',
    category: 'BANNED_KEYWORD',
    scraped_at: new Date().toISOString()
  });
  console.log("Insert error:", error);
}
fixSpam();
