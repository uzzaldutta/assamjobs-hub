import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Use ANON key to test RLS!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testRPC() {
  const queries = [
    "Assam Police",
    "assam polise",
    "ADRE",
    "percentage",
    "teacher",
    "xyzabc987654",
    "",
    "adRE"
  ];

  for (const q of queries) {
    console.log(`\n--- Query: "${q}" ---`);
    const { data, error } = await supabase.rpc("global_discovery_search", {
      search_query: q
    });
    
    if (error) {
      console.error("RPC Error:", error.message);
    } else {
      console.log(`Results: ${data?.length || 0}`);
      if (data && data.length > 0) {
        console.log(`Top match: [${data[0].item_type}] ${data[0].title} (Score: ${data[0].relevance_score})`);
      }
    }
  }
}

testRPC();
