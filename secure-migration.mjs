import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateData() {
  console.log("Starting secure data migration...");
  const { data: questions, error } = await supabase.from("prep_questions").select("*");
  
  if (error) {
    console.error("Failed to fetch questions:", error.message);
    return;
  }

  if (!questions || questions.length === 0) {
    console.log("No questions found in database. Safe to apply constraints.");
    return;
  }

  console.log(`Found ${questions.length} questions. Checking for invalid formats...`);
  
  const validAnswers = ['A', 'B', 'C', 'D'];
  const updates = [];
  const failures = [];

  for (const q of questions) {
    if (!validAnswers.includes(q.correct_answer)) {
      console.log(`[MIGRATION REQUIRED] Question ID: ${q.id} | Current Answer: "${q.correct_answer}"`);
      
      const options = q.options;
      let matchedLetter = null;

      if (options.A === q.correct_answer) matchedLetter = 'A';
      else if (options.B === q.correct_answer) matchedLetter = 'B';
      else if (options.C === q.correct_answer) matchedLetter = 'C';
      else if (options.D === q.correct_answer) matchedLetter = 'D';

      if (matchedLetter) {
        console.log(` -> Successfully mapped to Option ${matchedLetter}`);
        updates.push({ id: q.id, correct_answer: matchedLetter });
      } else {
        console.log(` -> ERROR: Could not map "${q.correct_answer}" to any option! Options were:`, options);
        failures.push(q.id);
      }
    }
  }

  if (failures.length > 0) {
    console.error(`\nMIGRATION HALTED: ${failures.length} questions could not be safely mapped.`);
    console.error("Affected Question IDs:", failures);
    console.error("Please review these manually.");
    return;
  }

  if (updates.length > 0) {
    console.log(`\nProceeding to update ${updates.length} records...`);
    for (const update of updates) {
      const { error: upErr } = await supabase.from("prep_questions").update({ correct_answer: update.correct_answer }).eq("id", update.id);
      if (upErr) {
        console.error("Failed to update question", update.id, upErr.message);
      }
    }
    console.log("Migration complete! All answers are now correctly formatted as A/B/C/D.");
  } else {
    console.log("All existing questions already have correct A/B/C/D format. No migration needed.");
  }
}

migrateData();
