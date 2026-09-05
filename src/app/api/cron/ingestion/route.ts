
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { IngestionPipeline } from '@/lib/ingestion/pipeline';
import { APSCAdapter } from '@/lib/ingestion/adapters/APSCAdapter';
import { JobAssamAdapter } from '@/lib/ingestion/adapters/JobAssamAdapter';
import { NHMAssamAdapter } from '@/lib/ingestion/adapters/NHMAssamAdapter';
import { GenericAssamGovAdapter } from '@/lib/ingestion/adapters/GenericAssamGovAdapter';
import { AssamCareerAdapter } from '@/lib/ingestion/adapters/AssamCareerAdapter';

// Secure the route with a cron secret
const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: sources } = await supabase.from('ingestion_sources').select('*').eq('is_active', true);
    if (!sources || sources.length === 0) return NextResponse.json({ message: 'No active sources' });

    // In a real high-scale system, this would push to a worker queue (e.g. Inngest / AWS SQS)
    // For this Phase 6.x architecture, we will process sequentially or via Promise.allSettled
    
    const results = [];
    for (const source of sources) {
        let adapterInstance: any;
        if (source.adapter_name === 'APSCAdapter') adapterInstance = new APSCAdapter(source);
        else if (source.adapter_name === 'JobAssamAdapter') adapterInstance = new JobAssamAdapter(source);
        else if (source.adapter_name === 'AssamCareerAdapter') adapterInstance = new AssamCareerAdapter(source);
        else if (source.adapter_name === 'GenericAssamGovAdapter') adapterInstance = new GenericAssamGovAdapter(source);
        else if (source.adapter_name === 'NHMAssamAdapter') adapterInstance = new NHMAssamAdapter(source);
        
        if (adapterInstance) {
            // Background execution
            IngestionPipeline.processSource(adapterInstance).catch(err => console.error(err));
            results.push({ source: source.source_name, status: 'started' });
        } else {
            results.push({ source: source.source_name, status: 'unsupported_adapter' });
        }
    }

    return NextResponse.json({ success: true, triggered: results });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
