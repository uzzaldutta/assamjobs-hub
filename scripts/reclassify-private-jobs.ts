import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const dns = require('dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

// Mock next/cache
const nextCache = require('next/cache');
nextCache.revalidatePath = () => {};

async function runReclassification() {
  const { supabaseAdmin: sb } = await import('@/lib/supabase');
  const { classifyJobType } = await import('@/lib/jobClassifier');

  console.log('Fetching all jobs currently labeled as GOVERNMENT or JOB...');
  const { data: jobs, error } = await sb
    .from('jobs')
    .select('id, title, organization, job_type, category')
    .in('job_type', ['GOVERNMENT', 'JOB']);

  if (error) {
    console.error('Error fetching jobs:', error);
    return;
  }

  console.log(`Analyzing ${jobs.length} jobs for private sector classification...`);

  let updatedPrivateCount = 0;
  let updatedRailwayCount = 0;

  for (const job of jobs) {
    const correctType = classifyJobType(job.title, job.organization);

    if (correctType === 'PRIVATE') {
      const { error: updateErr } = await sb
        .from('jobs')
        .update({
          job_type: 'PRIVATE',
          category: job.category === 'OTHER' ? 'LOCAL_PRIVATE' : job.category
        })
        .eq('id', job.id);

      if (!updateErr) {
        updatedPrivateCount++;
        console.log(`[-> PRIVATE] ${job.title.slice(0, 70)} (Org: ${job.organization || 'N/A'})`);
      }
    } else if (correctType === 'RAILWAY' && job.job_type !== 'RAILWAY') {
      const { error: updateErr } = await sb
        .from('jobs')
        .update({ job_type: 'RAILWAY' })
        .eq('id', job.id);

      if (!updateErr) {
        updatedRailwayCount++;
        console.log(`[-> RAILWAY] ${job.title.slice(0, 70)}`);
      }
    }
  }

  console.log(`\nReclassification Complete!`);
  console.log(`Successfully updated ${updatedPrivateCount} jobs to PRIVATE.`);
  console.log(`Successfully updated ${updatedRailwayCount} jobs to RAILWAY.`);
}

runReclassification().catch(console.error);
