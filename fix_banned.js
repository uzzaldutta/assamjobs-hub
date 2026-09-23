const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBanned() {
  const { data, error } = await supabase
    .from('jobs')
    .update({ status: 'ARCHIVED', job_type: 'SYSTEM' })
    .eq('category', 'BANNED_KEYWORD');
  
  if (error) console.error("Error fixing banned keywords:", error);
  else console.log("Fixed banned keywords.");
}

fixBanned();
