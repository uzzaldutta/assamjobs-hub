import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data } = await supabase.from('jobs').select('id, title, job_type').eq('job_type', 'ADMISSION').limit(5);
  console.log("Jobs with job_type=ADMISSION:", data);
}
check();
