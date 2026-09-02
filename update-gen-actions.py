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
    language: string;
    sourceGrounded: boolean;
  }
) {
  await verifyAdmin();
  
  if (count > 25) throw new Error("Maximum batch size is 25 to ensure quality and prevent timeouts.");
  if (metadata.sourceGrounded && !sourceText.trim()) throw new Error("Source context cannot be empty in Source Grounded mode.");

  // For very large batches, we could chunk it, but we are capping at 25 for now.
  const generatedData = await generateMCQsWithGemini(sourceText || "General Knowledge", count, metadata);
  
  const validatedQuestions = [];
  
  for (const q of generatedData) {
    let duplicateWarning = null;
    let duplicateScore = 0;
    let duplicateRisk = "LOW";
    
    // Check duplicates via RPC
    const { data: dupData } = await supabase.rpc("find_question_duplicates", {
      p_question_text: q.question_text,
      p_similarity_threshold: 0.5
    });

    if (dupData && dupData.length > 0) {
      duplicateWarning = dupData[0].question_text;
      duplicateScore = dupData[0].similarity_score;
      duplicateRisk = duplicateScore > 0.85 ? "HIGH" : "POSSIBLE";
    }

    validatedQuestions.push({
      ...q,
      duplicateWarning,
      duplicateScore: duplicateScore ? Math.round(duplicateScore * 100) : 0,
      duplicateRisk,
      id: "temp_" + Math.random().toString(36).substr(2, 9), 
    });
  }

  return validatedQuestions;
}
"""
with open("src/app/admin/studio/generator/actions.ts", "w", encoding="utf-8") as f:
    f.write(code)
