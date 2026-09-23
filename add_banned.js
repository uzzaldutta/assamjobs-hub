const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addBanned() {
  const kws = [
    'advertise with us', 
    'recruitment advertising', 
    'image resizer', 
    'image combiner', 
    'images to pdf', 
    'qr code generator', 
    'pdf tools', 
    'pdf converter',
    'photo maker',
    'photo resizer',
    'resume builder',
    'bio-data maker'
  ];

  for (const keyword of kws) {
    const cleanKeyword = keyword.trim().toLowerCase();
    
    // Check if exists
    const { data: existing } = await supabase.from('jobs').select('id').eq('category', 'BANNED_KEYWORD').eq('title', cleanKeyword);
    if (!existing || existing.length === 0) {
      const { error } = await supabase.from('jobs').insert({
        id: `banned_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        title: cleanKeyword,
        category: 'BANNED_KEYWORD',
        organization: 'SYSTEM',
        job_type: 'PRIVATE',
        scraped_at: new Date().toISOString()
      });
      if (error) console.error("Error adding", cleanKeyword, error);
      else console.log("Added BANNED_KEYWORD:", cleanKeyword);
    } else {
      console.log("Already exists:", cleanKeyword);
    }
  }
}

addBanned();
