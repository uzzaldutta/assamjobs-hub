const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function run() {
  console.log('Fetching jobs...');
  const { data: jobs, error } = await supabase.from('jobs').select('id, title, vacancies, last_date, category');
  if (error) { console.error(error); return; }
  
  const toDelete = [];
  
  for (const job of jobs) {
    if (job.category === 'BANNED_KEYWORD') continue;

    const v = job.vacancies ? String(job.vacancies).toLowerCase().trim() : '';
    const d = job.last_date ? String(job.last_date).toLowerCase().trim() : '';
    
    // Strict rules: must have valid vacancies OR valid last date
    const hasVacancies = v !== '' && v !== 'not specified' && v !== 'multiple' && v !== 'various' && v !== 'various posts';
    const hasLastDate = d !== '' && d !== 'tbd' && d !== 'null' && d !== 'not specified';

    // additional spam title check
    const t = job.title ? job.title.toLowerCase() : '';
    const isSpamTitle = t.includes('private sector recruitment') || t.includes('private job recruitment') || t.includes('private job vacancy') || t.includes('job requirement');

    if ((!hasVacancies && !hasLastDate) || isSpamTitle) {
      toDelete.push(job.id);
    }
  }
  
  console.log('Found ' + toDelete.length + ' strict-invalid jobs to delete.');
  console.log(toDelete);
  
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
