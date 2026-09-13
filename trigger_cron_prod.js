const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function run() {
    const res = await fetch('https://assamjobshub.com/api/cron/ingestion', { method: 'GET', headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` } });
    console.log("Status:", res.status);
    const json = await res.json().catch(e => null);
    console.log(json);
}
run();
