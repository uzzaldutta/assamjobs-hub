import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSource() {
  const { data, error } = await supabase.from('ingestion_sources').select('*');
  if (error) console.error(error);
  else console.log(JSON.stringify(data.map(d => d.source_name + " - " + d.base_url), null, 2));
}
checkSource();
