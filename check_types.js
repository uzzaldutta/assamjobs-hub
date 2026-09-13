const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data } = await supabase.from('jobs').select('job_type');
    const types = new Set(data.map(d => d.job_type));
    console.log("Distinct job_types in jobs table:", Array.from(types));
}
check();
