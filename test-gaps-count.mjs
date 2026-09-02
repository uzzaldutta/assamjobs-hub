import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase
    .from("prep_topics")
    .select(`
      id, title,
      prep_chapters (id, title, prep_subjects (id, title, prep_exams (id, title))),
      prep_questions (count)
    `)
    .limit(5);
  console.log("Error:", error);
  if (data) {
    console.log("Sample Data:", JSON.stringify(data[0]));
  }
}
test();
