import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Mock next/cache so revalidatePath does not throw outside Next.js
const nextCache = require('next/cache');
nextCache.revalidatePath = (path: string) => {
  console.log(`[revalidatePath] Revalidation triggered for: ${path}`);
};

import { supabaseAdmin as supabase } from '@/lib/supabase';
import { IngestionPipeline } from '@/lib/ingestion/pipeline';
import { AssamCareerAdapter } from '@/lib/ingestion/adapters/AssamCareerAdapter';
import { JobAssamHubAdapter } from '@/lib/ingestion/adapters/JobAssamHubAdapter';
import { JobAssamAdapter } from '@/lib/ingestion/adapters/JobAssamAdapter';
import { APSCAdapter } from '@/lib/ingestion/adapters/APSCAdapter';
import { GenericAssamGovAdapter } from '@/lib/ingestion/adapters/GenericAssamGovAdapter';
import { NHMAssamAdapter } from '@/lib/ingestion/adapters/NHMAssamAdapter';
import { GenericAggregatorAdapter } from '@/lib/ingestion/adapters/GenericAggregatorAdapter';
import { IndGovtJobsAdapter } from '@/lib/ingestion/adapters/IndGovtJobsAdapter';
import { approveQueueItemAction } from '@/app/admin/studio/ingestion/actions';

async function runExtraction() {
  console.log('=== Starting Feed Extraction ===');
  console.log('Timestamp:', new Date().toISOString());

  // 1. Fetch active sources from database
  const { data: sources, error } = await supabase
    .from('ingestion_sources')
    .select('*')
    .eq('is_active', true);

  if (error || !sources || sources.length === 0) {
    console.error('No active sources found or error:', error);
    return;
  }

  console.log(`Found ${sources.length} active sources:`, sources.map(s => `${s.source_name} (${s.adapter_name})`).join(', '));

  for (const source of sources) {
    console.log(`\n--- Processing Source: ${source.source_name} (${source.adapter_name}) ---`);
    let adapterInstance: any;

    if (source.adapter_name === 'AssamCareerAdapter') adapterInstance = new AssamCareerAdapter(source);
    else if (source.adapter_name === 'JobAssamHubAdapter') adapterInstance = new JobAssamHubAdapter(source);
    else if (source.adapter_name === 'JobAssamAdapter') adapterInstance = new JobAssamAdapter(source);
    else if (source.adapter_name === 'APSCAdapter') adapterInstance = new APSCAdapter(source);
    else if (source.adapter_name === 'GenericAssamGovAdapter') adapterInstance = new GenericAssamGovAdapter(source);
    else if (source.adapter_name === 'NHMAssamAdapter') adapterInstance = new NHMAssamAdapter(source);
    else if (source.adapter_name === 'GenericAggregatorAdapter') adapterInstance = new GenericAggregatorAdapter(source);
    else if (source.adapter_name === 'IndGovtJobsAdapter') adapterInstance = new IndGovtJobsAdapter(source);
    else {
      console.log(`Adapter ${source.adapter_name} not mapped, skipping`);
      continue;
    }

    try {
      await IngestionPipeline.processSource(adapterInstance);
      console.log(`✓ Completed extraction for: ${source.source_name}`);
    } catch (err: any) {
      console.error(`✗ Error processing ${source.source_name}:`, err.message);
    }
  }

  // 2. Auto-approve any new quality items
  const { data: newItems } = await supabase
    .from('ingestion_queue')
    .select('id, title, content_type, quality_score')
    .eq('status', 'NEW')
    .gte('quality_score', 20);

  if (newItems && newItems.length > 0) {
    console.log(`\n--- Auto-approving ${newItems.length} Clean Feeds ---`);
    for (const item of newItems) {
      if (!item.title || item.title.toLowerCase().includes('unknown')) continue;
      try {
        await approveQueueItemAction(item.id, 'NEW');
        console.log(`✓ Auto-approved: ${item.title}`);
      } catch (err: any) {
        console.error(`✗ Error approving ${item.title}:`, err.message);
      }
    }
  }

  console.log('\n=== Ingestion Completed ===');

  // Query latest 5 jobs from Supabase
  const { data: latestJobs } = await supabase
    .from('jobs')
    .select('id, title, category, scraped_at')
    .order('scraped_at', { ascending: false })
    .limit(5);

  console.log('\nLatest Jobs in Database:');
  console.table(latestJobs);

  // Query latest 5 queue items
  const { data: latestQueue } = await supabase
    .from('ingestion_queue')
    .select('id, title, content_type, status, quality_score, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('\nLatest Ingestion Queue Items:');
  console.table(latestQueue);
}

runExtraction().catch(err => {
  console.error('Fatal error during feed extraction:', err);
  process.exit(1);
});
