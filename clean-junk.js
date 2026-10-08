const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function clean() {
    const { data } = await supabase.from('jobs').select('id, title');
    let deleted = 0;
    for (let d of data) {
        if (d.title.length <= 15) {
            await supabase.from('jobs').delete().eq('id', d.id);
            deleted++;
            console.log('Deleted short title:', d.title);
        }
    }
    console.log('Deleted total:', deleted);
}
clean();