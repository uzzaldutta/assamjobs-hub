code = """
import { supabase } from "@/lib/supabase";
import StudioDashboardClient from "./StudioDashboardClient";

export const revalidate = 0;

export default async function StudioDashboard() {
  let stats = {
    totalQuestions: 0,
    draftQuestions: 0,
    reviewQuestions: 0,
    approvedQuestions: 0,
    publishedQuestions: 0,
    totalMaterials: 0,
    publishedMaterials: 0,
    questionsAddedToday: 0,
    duplicateRisks: 0,
    missingExplanations: 0,
  };

  try {
    const today = new Date();
    today.setHours(0,0,0,0);

    const [
      { count: totalQ }, { count: draftQ }, { count: reviewQ }, { count: approvedQ }, { count: pubQ },
      { count: todayQ }, { count: dupRiskQ }, { count: missExpQ },
      { count: totalM }, { count: pubM }
    ] = await Promise.all([
      supabase.from("prep_questions").select("*", { count: "exact", head: true }),
      supabase.from("prep_questions").select("*", { count: "exact", head: true }).eq("status", "DRAFT"),
      supabase.from("prep_questions").select("*", { count: "exact", head: true }).eq("status", "REVIEW"),
      supabase.from("prep_questions").select("*", { count: "exact", head: true }).eq("status", "APPROVED"),
      supabase.from("prep_questions").select("*", { count: "exact", head: true }).eq("status", "PUBLISHED"),
      supabase.from("prep_questions").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
      supabase.from("prep_questions").select("*", { count: "exact", head: true }).contains("tags", ["ai-generated"]), // basic proxy for AI generated
      supabase.from("prep_questions").select("*", { count: "exact", head: true }).is("explanation", null),
      supabase.from("prep_materials").select("*", { count: "exact", head: true }),
      supabase.from("prep_materials").select("*", { count: "exact", head: true }).eq("status", "PUBLISHED"),
    ]);

    stats = {
      totalQuestions: totalQ || 0,
      draftQuestions: draftQ || 0,
      reviewQuestions: reviewQ || 0,
      approvedQuestions: approvedQ || 0,
      publishedQuestions: pubQ || 0,
      totalMaterials: totalM || 0,
      publishedMaterials: pubM || 0,
      questionsAddedToday: todayQ || 0,
      duplicateRisks: dupRiskQ || 0,
      missingExplanations: missExpQ || 0,
    };
  } catch (e) {
    console.error("Stats Error", e);
  }

  return <StudioDashboardClient stats={stats} />;
}
"""
with open("src/app/admin/studio/page.tsx", "w", encoding="utf-8") as f:
    f.write(code)
