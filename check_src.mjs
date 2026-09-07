import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data } = await supabase.from('ingestion_sources').select('source_name').ilike('source_name', '%admission%');
  console.log("Sources with admission in name:", data);
  const { data: all } = await supabase.from('ingestion_sources').select('source_name, base_url');
  console.log("All sources:", all?.filter(s => s.base_url.includes('admission') || s.source_name.toLowerCase().includes('university') || s.source_name.toLowerCase().includes('seba') || s.source_name.toLowerCase().includes('ahsec')));
}
check();
