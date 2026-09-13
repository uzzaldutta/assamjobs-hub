const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: runs } = await supabase.from('ingestion_runs').select('*').eq('source_id', '9db02309-0cb3-4ad1-91a3-61defa2c0758').order('started_at', { ascending: false }).limit(2);
    console.log(runs);
}
check();
