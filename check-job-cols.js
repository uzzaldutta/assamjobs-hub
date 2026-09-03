const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkCols() {
  const { data, error } = await supabase.from('jobs').select('*').limit(1);
  if (data && data.length > 0) {
    console.log("Job Columns:", Object.keys(data[0]).join(', '));
  } else if (error) {
    console.log("Error:", error.message);
  }
}
checkCols();
