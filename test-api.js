const { createClient } = require('@supabase/supabase-js');

async function testApi() {
  const res = await fetch('http://localhost:9000/api/admin/spam-control', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: 'bio-data', password: 'assamhub2026' })
  });
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Data:", data);
}
testApi();
