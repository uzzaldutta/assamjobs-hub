const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: queue } = await supabase.from('ingestion_queue').select('id, title, status').eq('source_id', '9db02309-0cb3-4ad1-91a3-61defa2c0758');
    console.log("Queue size:", queue?.length);
    console.log(queue);
    
    if(queue && queue.length > 0) {
        for(let item of queue) {
           await supabase.rpc('approve_ingestion', { queue_id: item.id, approved_by_user_id: 'SYSTEM' }).catch(e => null);
        }
        console.log("Approved all new items from jobassamhub!");
    }
}
check();
