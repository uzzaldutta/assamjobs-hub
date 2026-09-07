import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runIngestionTest() {
  const { data: source } = await supabase.from('ingestion_sources').select('*').eq('source_name', 'IndGovtJobs').single();
  
  const res = await fetch('http://localhost:3000/api/admin/test-source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId: source.id, limit: 3 })
  });
  
  const result = await res.json();
  console.log(JSON.stringify(result, null, 2));
}
runIngestionTest();
