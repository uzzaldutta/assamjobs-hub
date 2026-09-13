const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: jobs } = await supabase.from('jobs').select('id, title, job_type').eq('job_type', 'ADMIT_CARD');
    console.log("ADMIT CARD jobs:", jobs?.length);

    const { data: admit_cards } = await supabase.from('admit_cards').select('id, title');
    console.log("admit_cards table:", admit_cards?.length);

    const { data: results } = await supabase.from('jobs').select('id, title, job_type').eq('job_type', 'RESULT');
    console.log("RESULT jobs:", results?.length);

    const { data: results_tbl } = await supabase.from('results').select('id, title');
    console.log("results table:", results_tbl?.length);
}
check();
