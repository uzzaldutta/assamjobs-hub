const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDb() {
  const keywords = ['advertise with us', 'image resizer', 'image combiner', 'images to pdf', 'qr code generator', 'recruitment advertising'];
  
  for (const kw of keywords) {
    const { data, error } = await supabase.from('jobs').delete().ilike('title', `%${kw}%`);
    if (error) console.error("Error deleting", kw, error);
    else console.log("Deleted for keyword:", kw);
  }
}

cleanDb();
