import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectMockTests() {
  console.log("INSPECTING PREP_MOCK_TESTS...");
  const { data: tests, error: testErr } = await supabase.from("prep_mock_tests").select("*").limit(1);
  if (testErr) console.error("Error:", testErr.message);
  else if (tests && tests.length > 0) {
    console.log("Columns:", Object.keys(tests[0]).join(", "));
    console.log("Sample:", JSON.stringify(tests[0], null, 2));
  } else {
    console.log("prep_mock_tests is empty.");
  }

  console.log("\nINSPECTING PREP_MOCK_TEST_QUESTIONS...");
  const { data: mapping, error: mapErr } = await supabase.from("prep_mock_test_questions").select("*").limit(1);
  if (mapErr) console.error("Error:", mapErr.message);
  else if (mapping && mapping.length > 0) {
    console.log("Columns:", Object.keys(mapping[0]).join(", "));
    console.log("Sample:", JSON.stringify(mapping[0], null, 2));
  } else {
    console.log("prep_mock_test_questions is empty.");
  }
}

inspectMockTests();
