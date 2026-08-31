const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function testSpam() {
  const cleanKeyword = 'bio-data';
  const { data: spamJobs, error: searchError } = await supabase
    .from('jobs')
    .select('id, title')
    .neq('category', 'BANNED_KEYWORD')
    .ilike('title', `%${cleanKeyword}%`);
    
  console.log("Spam Jobs Found:", spamJobs);
  console.log("Search Error:", searchError);
}
testSpam();
