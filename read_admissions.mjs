import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function investigate() {
  console.log("--- Admissions Table ---");
  const { data: totalAdms } = await supabase.from('admissions').select('id, status, created_at, closing_date', { count: 'exact' });
  console.log("Total Records:", totalAdms?.length);
  
  const pub = totalAdms?.filter(a => a.status === 'PUBLISHED').length || 0;
  const pend = totalAdms?.filter(a => a.status === 'PENDING').length || 0;
  const rej = totalAdms?.filter(a => a.status === 'REJECTED').length || 0;
  console.log(`PUBLISHED: ${pub}, PENDING: ${pend}, REJECTED: ${rej}`);
  
  if (totalAdms?.length) {
    const sorted = [...totalAdms].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    console.log("Most recent:", sorted[0]);
  }

  console.log("\n--- Ingestion Queue (ADMISSION) ---");
  const { data: qAdms } = await supabase.from('ingestion_queue').select('id, status, created_at').eq('content_type', 'ADMISSION');
  console.log("Total Queue Records:", qAdms?.length);
}
investigate();
