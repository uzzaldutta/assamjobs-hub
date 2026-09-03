const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function runApiTest() {
    try {
        const res = await fetch(`http://localhost:3000/api/admin/test-source`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ sourceId: 'dummy', adapterName: 'JobAssamAdapter' })
        });
        const data = await res.json();
        console.log(data);
    } catch(e) {
        console.error(e);
    }
}
runApiTest();
