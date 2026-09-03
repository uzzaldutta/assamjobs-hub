const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkExams() {
  const { data, error } = await supabase.from('prep_exams').select('*').limit(1);
  if (error) {
    console.log("prep_exams Error:", error.message);
  } else {
    console.log("prep_exams exists.");
  }
}
checkExams();
