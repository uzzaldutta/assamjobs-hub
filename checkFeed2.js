require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: cols, error } = await supabase.from('jobs').select('*').limit(1);
  if (cols && cols.length > 0) {
      console.log('Job columns:', Object.keys(cols[0]));
  }
}
run();
