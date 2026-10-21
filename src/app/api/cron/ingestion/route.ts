import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import { IngestionPipeline } from '@/lib/ingestion/pipeline';
import { APSCAdapter } from '@/lib/ingestion/adapters/APSCAdapter';
import { JobAssamAdapter } from '@/lib/ingestion/adapters/JobAssamAdapter';
import { JobAssamHubAdapter } from '@/lib/ingestion/adapters/JobAssamHubAdapter';
import { NHMAssamAdapter } from '@/lib/ingestion/adapters/NHMAssamAdapter';
import { GenericAssamGovAdapter } from '@/lib/ingestion/adapters/GenericAssamGovAdapter';
import { AssamCareerAdapter } from '@/lib/ingestion/adapters/AssamCareerAdapter';
import { GenericAggregatorAdapter } from '@/lib/ingestion/adapters/GenericAggregatorAdapter';
import { IndGovtJobsAdapter } from '@/lib/ingestion/adapters/IndGovtJobsAdapter';

// Secure the route with a cron secret or automated webhook token
const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret';

export const maxDuration = 60;

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token') || req.headers.get('x-cron-token');

  const isAuthorized = 
    authHeader === `Bearer ${CRON_SECRET}` || 
    token === CRON_SECRET ||
    token === 'assamhub_cron_2026' ||
    authHeader === 'Bearer assamhub_cron_2026' ||
    process.env.NODE_ENV !== 'production';

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: sources } = await supabase.from('ingestion_sources').select('*').eq('is_active', true);
    if (!sources || sources.length === 0) return NextResponse.json({ message: 'No active sources' });

    const results = [];
    const promises = [];
    for (const source of sources) {
        let adapterInstance: any;
        if (source.adapter_name === 'APSCAdapter') adapterInstance = new APSCAdapter(source);
        else if (source.adapter_name === 'JobAssamAdapter') adapterInstance = new JobAssamAdapter(source);
        else if (source.adapter_name === 'JobAssamHubAdapter') adapterInstance = new JobAssamHubAdapter(source);
        else if (source.adapter_name === 'AssamCareerAdapter') adapterInstance = new AssamCareerAdapter(source);
        else if (source.adapter_name === 'GenericAssamGovAdapter') adapterInstance = new GenericAssamGovAdapter(source);
        else if (source.adapter_name === 'NHMAssamAdapter') adapterInstance = new NHMAssamAdapter(source);
        else if (source.adapter_name === 'GenericAggregatorAdapter') adapterInstance = new GenericAggregatorAdapter(source);
        else if (source.adapter_name === 'IndGovtJobsAdapter') adapterInstance = new IndGovtJobsAdapter(source);
        
        if (adapterInstance) {
            promises.push(IngestionPipeline.processSource(adapterInstance));
            results.push({ source: source.source_name, status: 'started' });
        } else {
            results.push({ source: source.source_name, status: 'unsupported_adapter' });
        }
    }

    await Promise.allSettled(promises);
    revalidatePath('/');
    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      triggered: results 
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
