const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testSearch(q) {
  const { data, error } = await supabase.rpc("global_discovery_search", { search_query: q });
  console.log("RPC Error:", error);
  console.log("RPC Data:", data);
}
testSearch("Agniveer");
testSearch("Admit");
testSearch("SSC");
