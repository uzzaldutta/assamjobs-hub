code = """
"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { generateMCQsWithGemini } from "@/lib/ai/gemini";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (token !== "admin_secure_session_token_123") {
    throw new Error("Unauthorized");
  }
}

export async function generateQuestionsAction(
  sourceText: string,
  count: number,
  metadata: {
    exam: string;
    subject: string;
    topic: string;
    difficulty: string;
  }
) {
  await verifyAdmin();
  
  if (count > 25) throw new Error("Maximum batch size is 25 to ensure quality and prevent timeouts.");
  if (!sourceText.trim()) throw new Error("Source context cannot be empty.");

  const generatedData = await generateMCQsWithGemini(sourceText, count, metadata);
  
  // Validate and attach duplicate warnings
  const validatedQuestions = [];
  
  for (const q of generatedData) {
    let duplicateWarning = null;
    let duplicateRisk = "LOW";
    
    // Check duplicates via RPC
    const { data: dupData } = await supabase.rpc("find_question_duplicates", {
      p_question_text: q.question_text,
      p_similarity_threshold: 0.6
    });

    if (dupData && dupData.length > 0) {
      duplicateWarning = dupData[0].question_text;
      const score = dupData[0].similarity_score;
      duplicateRisk = score > 0.85 ? "HIGH" : "POSSIBLE";
    }

    validatedQuestions.push({
      ...q,
      duplicateWarning,
      duplicateRisk,
      id: "temp_" + Math.random().toString(36).substr(2, 9), // temp ID for UI
    });
  }

  return validatedQuestions;
}
"""
import os
os.makedirs("src/app/admin/studio/generator", exist_ok=True)
with open("src/app/admin/studio/generator/actions.ts", "w", encoding="utf-8") as f:
    f.write(code)
