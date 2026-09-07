import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
async function testCron() {
  const res = await fetch("http://localhost:9000/api/cron/ingestion", {
    headers: { "Authorization": `Bearer ${process.env.CRON_SECRET || ''}` }
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text.substring(0, 200));
}
testCron();
