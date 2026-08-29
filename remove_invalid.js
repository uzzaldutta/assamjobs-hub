const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function run() {
  console.log('Fetching jobs...');
  const { data: jobs, error } = await supabase.from('jobs').select('id, vacancies, last_date, category');
  if (error) { console.error(error); return; }
  
  const toDelete = [];
  
  for (const job of jobs) {
    if (job.category === 'BANNED_KEYWORD') continue; // keep the blocklist

    const hasVacancies = job.vacancies && job.vacancies.trim() !== '' && job.vacancies.toLowerCase() !== 'not specified';
    const hasLastDate = job.last_date && job.last_date.trim() !== '' && job.last_date.toLowerCase() !== 'tbd';

    if (!hasVacancies && !hasLastDate) {
      toDelete.push(job.id);
    }
  }
  
  console.log('Found ' + toDelete.length + ' invalid jobs without vacancies/dates to delete.');
  
  if (toDelete.length > 0) {
    for (let i = 0; i < toDelete.length; i += 100) {
       const batch = toDelete.slice(i, i + 100);
       const { error: delErr } = await supabase.from('jobs').delete().in('id', batch);
       if (delErr) console.error('Delete error:', delErr);
    }
    console.log('Invalid jobs deleted.');
  }
}
run();
