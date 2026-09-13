const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testGlobalSearch(q) {
  const rpcPromise = supabase.rpc("global_discovery_search", { search_query: q });
  
  const ilikeQ = `%${q}%`;
  const tendersPromise = supabase.from("tenders").select("id, title, department, closing_date, status").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);
  const admissionsPromise = supabase.from("admissions").select("id, title, institution, application_deadline, status").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);
  const resultsPromise = supabase.from("results").select("id, title, organization, result_date, status").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);
  const admitCardsPromise = supabase.from("admit_cards").select("id, title, organization, exam_date, status").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);
  const scholarshipsPromise = supabase.from("scholarships").select("id, title, provider, application_deadline, status").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);
  const materialsPromise = supabase.from("prep_materials").select("id, title, type, status, prep_exams(slug)").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);

  const [rpcRes, tendersRes, admissionsRes, resultsRes, admitCardsRes, scholarshipsRes, materialsRes] = await Promise.all([
    rpcPromise, tendersPromise, admissionsPromise, resultsPromise, admitCardsPromise, scholarshipsPromise, materialsPromise
  ]);
  
  console.log("RPC Error:", rpcRes.error);
  console.log("Admissions Error:", admissionsRes.error);
  
  let allResults = [];
  if (rpcRes.data) {
    allResults = rpcRes.data.map((row) => ({
      id: row.item_id || row.id,
      type: row.item_type || row.type,
      title: row.title,
      subtitle: row.subtitle,
      metadata: row.metadata,
      relevanceScore: row.relevance_score || 1
    }));
  }
  
  console.log("Found", allResults.length, "results for", q);
}

testGlobalSearch("Admit");
