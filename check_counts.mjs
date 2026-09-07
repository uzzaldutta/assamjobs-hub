import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkCounts() {
  const tables = ['admit_cards', 'admissions', 'results', 'tenders', 'scholarships', 'exams', 'prep_materials'];
  
  for (const table of tables) {
    const { count: total, error: err1 } = await supabase.from(table).select('*', { count: 'exact', head: true });
    const { count: pub, error: err2 } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED');
    
    console.log(`${table.padEnd(15)} | Total: ${total || 0} | Published: ${pub || 0}`);
  }
}

checkCounts();
