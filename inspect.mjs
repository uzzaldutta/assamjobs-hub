import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectSchema() {
  console.log("INSPECTING JOBS TABLE...");
  const { data: jobs, error: jErr } = await supabase.from("jobs").select("*").limit(1);
  if (jErr) {
    console.error("Jobs error:", jErr.message);
  } else {
    if (jobs && jobs.length > 0) {
      console.log("Jobs columns:", Object.keys(jobs[0]).join(", "));
      console.log("Sample Data:", JSON.stringify(jobs[0], null, 2));
    } else {
      console.log("Jobs table is empty, cannot infer from REST. Falling back to codebase inspection.");
    }
  }

  console.log("\nINSPECTING PREP_EXAMS TABLE...");
  const { data: exams, error: eErr } = await supabase.from("prep_exams").select("*").limit(1);
  if (eErr) console.error("Exams error:", eErr.message);
  else if (exams && exams.length > 0) console.log("Exams columns:", Object.keys(exams[0]).join(", "));
  else console.log("Prep Exams is empty.");

  console.log("\nINSPECTING PREP_TOPICS TABLE...");
  const { data: topics, error: tErr } = await supabase.from("prep_topics").select("*").limit(1);
  if (tErr) console.error("Topics error:", tErr.message);
  else if (topics && topics.length > 0) console.log("Topics columns:", Object.keys(topics[0]).join(", "));
  else console.log("Prep Topics is empty.");
}

inspectSchema();
