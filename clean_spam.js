const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function run() {
  console.log('Fetching jobs...');
  const { data: jobs, error } = await supabase.from('jobs').select('id, title, category, job_type, organization');
  if (error) { console.error(error); return; }
  
  console.log('Total jobs:', jobs.length);
  
  const spamKeywords = ['bio-data', 'whatsapp', 'telegram', 'join our', 'scheme', 'scholarship', 'merit award', 'banned_keyword'];
  const toDelete = [];
  
  for (const job of jobs) {
    if (job.category === 'BANNED_KEYWORD') {
      toDelete.push(job.id);
      continue;
    }
    
    if (job.title) {
      const lower = job.title.toLowerCase();
      if (spamKeywords.some(k => lower.includes(k))) {
        toDelete.push(job.id);
      }
    }
  }
  
  console.log('Found spam jobs to delete:', toDelete.length);
  
  if (toDelete.length > 0) {
    for (let i = 0; i < toDelete.length; i += 100) {
       const batch = toDelete.slice(i, i + 100);
       const { error: delErr } = await supabase.from('jobs').delete().in('id', batch);
       if (delErr) console.error('Delete error:', delErr);
    }
    console.log('Spam deleted.');
  }
}
run();
