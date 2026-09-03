const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const { JobAssamAdapter } = require('./src/lib/ingestion/adapters/JobAssamAdapter.ts');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testDiscovery() {
   const adapter = new JobAssamAdapter({ id: 'test-jobassam', base_url: 'https://jobassam.in', source_name: 'JobAssam' });
   try {
       const discovered = await adapter.discover();
       console.log(`JobAssam Discovered: ${discovered.length} items`);
       
       let results = 0;
       let admits = 0;
       let jobs = 0;

       // Fetch and Extract the first 5 to check classification
       for(let i=0; i<Math.min(5, discovered.length); i++) {
           const fetched = await adapter.fetch(discovered[i]);
           const extracted = await adapter.extract(fetched);
           const normalized = await adapter.normalize(extracted);
           
           if(normalized.contentType === 'RESULT') results++;
           else if(normalized.contentType === 'ADMIT_CARD') admits++;
           else jobs++;
           
           console.log(`- [${normalized.contentType}] ${normalized.title}`);
       }
   } catch(e) {
       console.error("Extraction failed", e);
   }
}
testDiscovery();
