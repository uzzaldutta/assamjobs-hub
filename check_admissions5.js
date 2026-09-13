const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data, error, count } = await supabase.from('jobs').select('course', { count: 'exact' }).eq('job_type', 'ADMISSION');
    console.log("Error:", error);
}
check();
