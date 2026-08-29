const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://smpedqhskoamagndfbfc.supabase.co', 'sb_publishable_fQYYSr9wDjtNsQQCEEbS9w_iix_jxCn');

async function run() {
  console.log('Fetching jobs for deduplication...');
  const { data, error } = await supabase.from('jobs').select('id, organization, vacancies, last_date, scraped_at, title').order('scraped_at', { ascending: true });
  if (error) { console.error(error); return; }
  
  const seenHashes = new Set();
  const duplicateIds = [];

  for (const job of data) {
    const org = (job.organization || '').toLowerCase().replace(/\s+/g, '');
    const vacancies = (job.vacancies || '').toString().toLowerCase().replace(/\s+/g, '');
    const lastDate = (job.last_date || '').toString().trim();
    const rawPublished = (job.scraped_at || '').toString();
    const publishedDate = rawPublished ? rawPublished.split('T')[0] : '';

    let hash;
    if (org && vacancies && lastDate && publishedDate) {
      hash = 'smart:' + org + '|' + vacancies + '|' + lastDate + '|' + publishedDate;
    } else {
      const title = (job.title || '').toLowerCase().replace(/\s+/g, '');
      hash = 'legacy:' + title + '|' + org;
    }

    if (seenHashes.has(hash)) {
      duplicateIds.push(job.id);
    } else {
      seenHashes.add(hash);
    }
  }
  
  console.log('Found duplicates:', duplicateIds.length);
  
  if (duplicateIds.length > 0) {
    for (let i = 0; i < duplicateIds.length; i += 100) {
      const batch = duplicateIds.slice(i, i + 100);
      await supabase.from('jobs').delete().in('id', batch);
    }
    console.log('Duplicates deleted.');
  }
}
run();
