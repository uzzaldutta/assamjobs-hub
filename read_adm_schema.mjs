import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function investigate() {
  const { data, error } = await supabase.from('admissions').select('*').limit(1);
  if (error) console.error("Admissions error:", error.message);
  else if (data) console.log("Admissions keys (empty or not):", Object.keys(data[0] || {}));
}
investigate();
