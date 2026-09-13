const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function run() {
    const res = await fetch('http://localhost:3000/api/cron/ingestion', { method: 'POST', headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` } });
    const json = await res.json();
    console.log(json);
}
run();
