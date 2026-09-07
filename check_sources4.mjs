import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function check() {
  const { data: nhm } = await supabase.from('ingestion_sources').select('*').ilike('source_name', '%nhm%');
  console.log("NHM:", nhm);
  const { data: emp } = await supabase.from('ingestion_sources').select('*').ilike('source_name', '%employment%');
  console.log("Employment Assam:", emp);
}
check();
