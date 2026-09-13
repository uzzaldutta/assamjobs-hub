require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clean() {
    const keywords = ['%Bio-Data%', '%WhatsApp%', '%Telegram%', '%Admit Card Generator%'];
    for (const kw of keywords) {
        const { data, error } = await supabase.from('jobs').delete().ilike('title', kw);
        console.log(`Deleted ${kw}`);
    }
}
clean();
