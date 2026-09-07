import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function run() {
  console.log("URL:", url ? "SET" : "MISSING");
  console.log("KEY:", key ? "SET" : "MISSING", key.substring(0,10) + "...");
  
  const { data: sources, error: err1 } = await supabase.from('ingestion_sources').select('*');
  if (err1) console.error("Error sources:", err1);
  console.log("Total ingestion_sources:", sources?.length || 0);
  
  if (sources && sources.length > 0) {
     console.log("Active sources:", sources.filter(s => s.is_active).length);
     console.log("First source:", sources[0].name);
  }

  const { count: qCount, error: err2 } = await supabase.from('ingestion_queue').select('*', { count: 'exact', head: true });
  console.log("Total ingestion_queue:", qCount, err2 || '');
  
  const { count: sCount, error: err3 } = await supabase.from('ingestion_daily_summaries').select('*', { count: 'exact', head: true });
  console.log("Total ingestion_daily_summaries:", sCount, err3 || '');
  
  const { count: jCount, error: err4 } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
  console.log("Total canonical jobs:", jCount, err4 || '');
}

run();
