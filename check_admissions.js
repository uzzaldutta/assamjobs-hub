const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: jobs, error } = await supabase.from('jobs').select('id, title, status, job_type').ilike('title', '%admission%');
    console.log(jobs);
}
check();
