import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  await supabase.from('ingestion_sources').update({ feed_type: 'MULTIPLE' }).eq('source_name', 'APSC');
  console.log("Updated APSC to MULTIPLE");
}
run();
