code = """
export async function bulkUpdateQuestionTagsAction(ids: string[], tags: string[]) {
  const { data, error } = await supabase
    .from("prep_questions")
    .update({ tags, updated_at: new Date().toISOString() })
    .in("id", ids)
    .select("id");

  if (error) throw new Error(error.message);
  return { success: true, count: data?.length || 0 };
}
"""
with open("src/app/admin/studio/actions.ts", "a", encoding="utf-8") as f:
    f.write(code)
