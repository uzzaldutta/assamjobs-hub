import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabaseAdmin as supabase } from '@/lib/supabase';

async function main() {
  const { data: recentJobs, error } = await supabase
    .from('jobs')
    .select('id, title, job_type, category, scraped_at, status')
    .order('scraped_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error('Error fetching jobs:', error);
    return;
  }

  console.log('\n--- 12 MOST RECENT ITEMS IN DATABASE ---');
  console.table(recentJobs);

  const { data: allJobs } = await supabase
    .from('jobs')
    .select('job_type');

  const counts: Record<string, number> = {};
  allJobs?.forEach(j => {
    const t = j.job_type || 'UNKNOWN';
    counts[t] = (counts[t] || 0) + 1;
  });

  console.log('\n--- JOBS COUNT BY TYPE ---');
  console.table(counts);

  const { count: queueCount } = await supabase
    .from('ingestion_queue')
    .select('*', { count: 'exact', head: true });

  const { count: jobCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true });

  console.log(`\nTotal Active Jobs/Feeds in DB: ${jobCount}`);
  console.log(`Total Ingestion Queue Records: ${queueCount}`);
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
