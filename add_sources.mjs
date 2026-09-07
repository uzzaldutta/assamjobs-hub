import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const sources = [
    {
      source_name: 'TheJobInAssam',
      base_url: 'https://thejobinassam.in/',
      adapter_name: 'GenericAggregatorAdapter',
      tier: 2,
      is_official: false,
      feed_type: 'MULTIPLE',
      is_active: true
    },
    {
      source_name: 'CareerAsom',
      base_url: 'https://careerasom.in',
      adapter_name: 'GenericAggregatorAdapter',
      tier: 2,
      is_official: false,
      feed_type: 'MULTIPLE',
      is_active: true
    },
    {
      source_name: 'AssamJobToday',
      base_url: 'https://assamjobtoday.com',
      adapter_name: 'GenericAggregatorAdapter',
      tier: 2,
      is_official: false,
      feed_type: 'MULTIPLE',
      is_active: true
    },
    {
      source_name: 'AssamOpenings',
      base_url: 'https://www.assamopenings.com/',
      adapter_name: 'GenericAggregatorAdapter',
      tier: 2,
      is_official: false,
      feed_type: 'MULTIPLE',
      is_active: true
    }
  ];
  
  for (const s of sources) {
    const { error } = await supabase.from('ingestion_sources').insert(s);
    if (error) {
      if (error.code === '23505') console.log(`Already exists: ${s.source_name}`);
      else console.log(`Error inserting ${s.source_name}:`, error.message);
    } else {
      console.log(`Inserted ${s.source_name}`);
    }
  }
}
run();
