const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTriggers() {
    const { data, error } = await supabase.rpc('get_pg_triggers', {});
    // Wait, the easiest way to find if there's a trigger is to grep .sql files for "CREATE TRIGGER".
    console.log("We can grep sql files for CREATE TRIGGER");
}
checkTriggers();
