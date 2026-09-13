const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: q } = await supabase.from('ingestion_queue').select('*').eq('source_id', 'jobassamhub'); // wait, I didn't give it 'jobassamhub' ID, it was random UUID?
    const { data: sources } = await supabase.from('ingestion_sources').select('*').eq('source_name', 'Job Assam Hub');
    console.log("Sources:", sources);
    
    if(sources && sources.length > 0) {
        const source_id = sources[0].id;
        const { data: queue } = await supabase.from('ingestion_queue').select('*').eq('source_id', source_id);
        console.log(`Queue items for ${source_name}:`, queue?.length);
    }
}
check();
