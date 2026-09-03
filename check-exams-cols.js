const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkExams() {
  const { data, error } = await supabase.from('prep_exams').select('*').limit(1);
  if (data && data.length > 0) {
    console.log("prep_exams Columns:", Object.keys(data[0]).join(', '));
  } else if (data) {
     console.log("prep_exams exists but is empty.");
     // fetch columns by creating a deliberate error or using rpc or querying another way
  }
}
checkExams();
