const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function unban() {
  const { data: bannedData } = await supabase.from('jobs').select('id, title').eq('category', 'BANNED_KEYWORD');
  const badBans = bannedData.filter(b => ['private', 'provate', 'job private', 'job recruitment'].includes(b.title.toLowerCase()));
  
  if (badBans.length > 0) {
    const ids = badBans.map(b => b.id);
    const { error } = await supabase.from('jobs').delete().in('id', ids);
    console.log("Unbanned:", badBans.map(b => b.title), "Error:", error);
  }
}
unban();
