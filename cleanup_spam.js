const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
    const { data, error } = await supabase.from('jobs').select('id, title, organization').ilike('title', '%JobAssam%');
    console.log("Found:", data?.length);
    if (data && data.length > 0) {
        const ids = data.map(d => d.id);
        const { error: delErr } = await supabase.from('jobs').delete().in('id', ids);
        if(delErr) console.log(delErr);
        else console.log("Deleted", ids.length, "spam jobs");
    }
}
cleanup();
