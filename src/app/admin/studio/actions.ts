
"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (token !== "admin_secure_session_token_123") {
    throw new Error("Unauthorized");
  }
}

export async function saveQuestionAction(payload: any) {
  await verifyAdmin();

  // Handle options (JSONB)
  const formattedPayload = {
    ...payload,
    options: {
      A: payload.optionA,
      B: payload.optionB,
      C: payload.optionC,
      D: payload.optionD,
    }
  };
  
  delete formattedPayload.optionA;
  delete formattedPayload.optionB;
  delete formattedPayload.optionC;
  delete formattedPayload.optionD;
  delete formattedPayload.exam_id;
  delete formattedPayload.subject_id;
  delete formattedPayload.chapter_id;

  const { data, error } = await supabase
    .from("prep_questions")
    .insert(formattedPayload)
    .select("id")
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(error.message);
  }

  return { success: true, id: data.id };
}

export async function checkDuplicateAction(questionText: string) {
  await verifyAdmin();
  
  if (!questionText || questionText.trim().length < 10) return null;

  const { data, error } = await supabase.rpc("find_question_duplicates", {
    p_question_text: questionText,
    p_similarity_threshold: 0.6
  });

  if (error) {
    console.error("Duplicate check error:", error);
    return null;
  }

  return data && data.length > 0 ? data[0] : null;
}


export async function bulkUpdateStatusAction(ids: string[], newStatus: string) {
  await verifyAdmin();
  
  if (!ids || ids.length === 0) return { success: false, error: "No IDs provided" };
  
  const { data, error } = await supabase
    .from("prep_questions")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .in("id", ids)
    .select("id");

  if (error) {
    console.error("Bulk update error:", error);
    throw new Error(error.message);
  }

  return { success: true, count: data?.length || 0 };
}

export async function updateQuestionInlineAction(id: string, updates: any) {
  await verifyAdmin();
  
  if (!id) return { success: false, error: "No ID provided" };
  
  const { data, error } = await supabase
    .from("prep_questions")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("Inline update error:", error);
    throw new Error(error.message);
  }

  return { success: true };
}
