import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data } = await supabase.from('jobs').select('id, category, content_type').ilike('category', '%admission%');
  console.log("Jobs with category ADMISSION:", data?.length);
  
  const { data: qData } = await supabase.from('ingestion_queue').select('content_type').ilike('content_type', '%admission%');
  console.log("Queue with content_type ADMISSION:", qData?.length);
}
check();
