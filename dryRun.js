require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const today = new Date().toISOString();
  
  // 1. Fetch Recent Items
  const [
    { data: rJobs },
    { data: rTenders },
  ] = await Promise.all([
    supabase.from('jobs').select('id, title, organization, job_type, last_date, scraped_at').eq('status', 'PUBLISHED').order('scraped_at', { ascending: false }).limit(6),
    supabase.from('tenders').select('id, title, organization, last_date, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(3)
  ]);

  const mapToFeed = (items, type, urlPrefix, orgField = 'organization') => {
    if (!items) return [];
    return items.map(item => ({
      id: item.id,
      title: item.title,
      badge_text: type === 'JOB' ? (item.job_type || 'GOVERNMENT') : type,
      last_date: item.last_date || null,
      created_at: item.created_at || item.scraped_at
    }));
  };

  const allRecent = [
    ...mapToFeed(rJobs || [], 'JOB', '/jobs'),
    ...mapToFeed(rTenders || [], 'TENDER', '/tenders')
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);
  
  console.log("allRecent length:", allRecent.length);
  
  const [{ data: cJobs }] = await Promise.all([
    supabase.from('jobs').select('id, title, organization, job_type, last_date, scraped_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(6)
  ]);
  
  const allClosing = [...mapToFeed(cJobs || [], 'JOB', '/jobs')];
  console.log("allClosing length:", allClosing.length);
}
run();
