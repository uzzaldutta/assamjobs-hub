require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkCols(table) {
  const { data, error } = await supabase.from(table).select('*').limit(1);
  console.log(table, 'error:', error?.message);
}

async function run() {
  await checkCols('tenders');
  await checkCols('admissions');
  await checkCols('results');
  await checkCols('admit_cards');
  await checkCols('scholarships');
}
run();
