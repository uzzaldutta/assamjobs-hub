code = """
import { supabase } from "@/lib/supabase";

export async function bulkUpdateQuestionStatusAction(ids: string[], status: string) {
  // Ensure this is properly authenticated in a real scenario
  const { data, error } = await supabase
    .from("prep_questions")
    .update({ status, updated_at: new Date().toISOString() })
    .in("id", ids)
    .select("id");

  if (error) throw new Error(error.message);
  return { success: true, count: data?.length || 0 };
}

export async function bulkUpdateQuestionTopicAction(ids: string[], topic_id: string) {
  const { data, error } = await supabase
    .from("prep_questions")
    .update({ topic_id, updated_at: new Date().toISOString() })
    .in("id", ids)
    .select("id");

  if (error) throw new Error(error.message);
  return { success: true, count: data?.length || 0 };
}

export async function bulkUpdateQuestionDifficultyAction(ids: string[], difficulty_level: string) {
  const { data, error } = await supabase
    .from("prep_questions")
    .update({ difficulty_level, updated_at: new Date().toISOString() })
    .in("id", ids)
    .select("id");

  if (error) throw new Error(error.message);
  return { success: true, count: data?.length || 0 };
}
"""
with open("src/app/admin/studio/actions.ts", "a", encoding="utf-8") as f:
    f.write(code)
