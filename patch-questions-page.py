code = """
import { supabase } from "@/lib/supabase";
import QuestionBankClient from "./QuestionBankClient";

export const revalidate = 0;

export default async function QuestionsPage({ searchParams }: { searchParams: { page?: string, q?: string, status?: string } }) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const query = searchParams.q || "";
  const statusFilter = searchParams.status || "";

  let questions: any[] = [];
  let totalCount = 0;

  try {
    let q = supabase
      .from("prep_questions")
      .select("*, prep_topics(title), prep_chapters(title), prep_subjects(title), prep_exams(title)", { count: "exact" });
      
    if (query) {
      q = q.ilike("question_text", `%${query}%`);
    }
    
    if (statusFilter) {
      q = q.eq("status", statusFilter);
    }

    const { data, count, error } = await q.order("created_at", { ascending: false }).range(from, to);

    if (error) console.error(error);
    if (data) questions = data;
    if (count) totalCount = count;
  } catch (e) {
    console.error(e);
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <QuestionBankClient 
      initialQuestions={questions}
      totalCount={totalCount}
      page={page}
      limit={limit}
      query={query}
      statusFilter={statusFilter}
      totalPages={totalPages}
    />
  );
}
"""

with open("src/app/admin/studio/questions/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
