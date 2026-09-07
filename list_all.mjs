import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSources() {
  const { data } = await supabase.from('ingestion_sources').select('source_name, base_url');
  console.log(data);
}
checkSources();
