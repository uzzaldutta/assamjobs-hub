const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function check() {
  const { data, error } = await supabase.from('tenders').select('id').limit(1);
  console.log("Tenders:", error ? error.message : "Exists");
  const { data:q, error: qErr } = await supabase.from('ingestion_queue').select('id').limit(1);
  console.log("Queue:", qErr ? qErr.message : "Exists");
}
check();
