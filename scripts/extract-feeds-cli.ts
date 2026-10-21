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
import { APSCAdapter } from '@/lib/ingestion/adapters/APSCAdapter';
import { GenericAssamGovAdapter } from '@/lib/ingestion/adapters/GenericAssamGovAdapter';

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

  console.log(`Found ${sources.length} active sources:`, sources.map(s => s.source_name).join(', '));

  for (const source of sources) {
    console.log(`\n--- Processing Source: ${source.source_name} (${source.adapter_name}) ---`);
    let adapterInstance: any;

    if (source.adapter_name === 'AssamCareerAdapter') adapterInstance = new AssamCareerAdapter(source);
    else if (source.adapter_name === 'JobAssamHubAdapter') adapterInstance = new JobAssamHubAdapter(source);
    else if (source.adapter_name === 'APSCAdapter') adapterInstance = new APSCAdapter(source);
    else if (source.adapter_name === 'GenericAssamGovAdapter') adapterInstance = new GenericAssamGovAdapter(source);
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
