import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkJobs() {
  const { data, error } = await supabase.from('jobs').select('title, organization, category, job_type').ilike('title', '%railway%');
  if (error) console.error(error);
  else console.log(data);
}
checkJobs();
