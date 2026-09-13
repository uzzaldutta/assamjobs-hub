const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    let queryBuilder = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('status', 'PUBLISHED')
    .or('job_type.eq.SCHOLARSHIP,title.ilike.%scholarship%,title.ilike.%scheme%');

    const { data: scholarships, count, error } = await queryBuilder.range(0, 19);
    console.log("Error:", error);
    console.log("Count:", count);
}
check();
