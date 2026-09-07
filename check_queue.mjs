import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkQueue() {
  const { data, error } = await supabase.from('ingestion_queue').select('feed_type');
  
  if (error) { console.error(error); return; }
  
  const counts = data.reduce((acc, curr) => {
    acc[curr.feed_type] = (acc[curr.feed_type] || 0) + 1;
    return acc;
  }, {});
  
  console.log("Ingestion Queue Types:", counts);
}

checkQueue();
