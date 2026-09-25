const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase
    .from('jobs')
    .select('title, scraped_at')
    .order('scraped_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

check();
