import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function check() {
  const { data } = await supabase.from('ingestion_queue').select('content_type, status');
  const counts = data.reduce((acc, curr) => {
    acc[curr.content_type] = (acc[curr.content_type] || 0) + 1;
    return acc;
  }, {});
  console.log("Queue Content Types:", counts);
}
check();
