const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup2() {
    const { data, error } = await supabase.from('jobs').select('id, title, organization').ilike('title', '%tool%');
    console.log("Found tools:", data?.length);
    if (data && data.length > 0) {
        console.log(data.map(d => d.title).join("\n"));
        // Only delete obvious ones, or we just manually delete
    }
}
cleanup2();
