import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function run() {
  const { data: sources, error: err1 } = await supabase.from('ingestion_sources').select('*');
  console.log("Anon Key sources:", sources?.length || 0, err1 || '');
}

run();
