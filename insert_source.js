const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertSource() {
    const { data, error } = await supabase.from('ingestion_sources').insert([
        {
            source_name: "Job Assam Hub",
            base_url: "https://jobassamhub.com",
            adapter_name: "JobAssamHubAdapter",
            is_official: false,
            tier: 2,
            is_active: true
        }
    ]);
    if(error) console.log(error);
    else console.log("Source added successfully!");
}
insertSource();
