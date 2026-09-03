require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const tables = ['jobs', 'tenders', 'admissions', 'results', 'admit_cards', 'scholarships'];
  for (const t of tables) {
     const { data, error } = await supabase.from(t).select('*').limit(1);
     if (error) {
       console.log(`Error on ${t}:`, error.message);
     } else {
       console.log(`Schema for ${t}:`, Object.keys(data[0] || {}));
     }
  }
}
check();
