code = """
import { supabase } from "@/lib/supabase";
import MaterialsClient from "./MaterialsClient";

export const revalidate = 0;

export default async function MaterialsPage({ searchParams }: { searchParams: { page?: string, q?: string, type?: string, status?: string } }) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const query = searchParams.q || "";
  const typeFilter = searchParams.type || "";
  const statusFilter = searchParams.status || "";

  let materials: any[] = [];
  let totalCount = 0;

  try {
    let q = supabase
      .from("prep_materials")
      .select("*, prep_topics(title), prep_chapters(title), prep_subjects(title), prep_exams(title)", { count: "exact" });
      
    if (query) q = q.ilike("title", `%${query}%`);
    if (typeFilter) q = q.eq("type", typeFilter);
    if (statusFilter) q = q.eq("status", statusFilter);

    const { data, count, error } = await q.order("created_at", { ascending: false }).range(from, to);

    if (error) console.error(error);
    if (data) materials = data;
    if (count) totalCount = count;
  } catch (e) {
    console.error(e);
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <MaterialsClient 
      initialMaterials={materials}
      totalCount={totalCount}
      page={page}
      limit={limit}
      query={query}
      typeFilter={typeFilter}
      statusFilter={statusFilter}
      totalPages={totalPages}
    />
  );
}
"""
with open("src/app/admin/studio/materials/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
