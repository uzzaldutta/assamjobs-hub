with open("src/app/admin/studio/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

new_actions = """

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
"""

with open("src/app/admin/studio/actions.ts", "a", encoding="utf-8") as f:
    f.write(new_actions)
