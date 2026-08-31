const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function fixSpam() {
  await supabase.from('jobs').insert({
    id: `banned_1788199077999_xyz`,
    title: 'learn with spk',
    organization: 'SYSTEM',
    job_type: 'PRIVATE',
    category: 'BANNED_KEYWORD',
    scraped_at: new Date().toISOString()
  });

  const { data: spamJobs } = await supabase
    .from('jobs')
    .select('id')
    .ilike('title', '%learn with spk%');

  if (spamJobs && spamJobs.length > 0) {
    const ids = spamJobs.map(j => j.id);
    await supabase.from('jobs').delete().in('id', ids);
    console.log("Deleted", ids.length, "spam jobs");
  } else {
    console.log("No spam jobs found to delete");
  }
}
fixSpam();
