
import { supabase } from "@/lib/supabase";
import { PaginatedSearchResult } from "./searchTypes";

export async function executeGlobalSearch(query: string, page: number = 1, limit: number = 20): Promise<PaginatedSearchResult> {
  const safeLimit = Math.min(Math.max(limit, 1), 50); // Enforce max 50
  const safePage = Math.max(page, 1);
  const offset = (safePage - 1) * safeLimit;
  const q = (query || "").trim();

  if (!q) return { results: [], totalCount: 0, currentPage: safePage, pageSize: safeLimit, hasNext: false, hasPrevious: false };

  // Run the legacy RPC for Jobs, Exams, Topics, Mock Tests
  const rpcPromise = supabase.rpc("global_discovery_search", { search_query: q });
  
  // Run queries for the Phase 6 tables
  const ilikeQ = `%${q}%`;
  const tendersPromise = supabase.from("tenders").select("id, title, department, closing_date, status").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);
  const admissionsPromise = supabase.from("admissions").select("id, title, institution, application_deadline, status").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);
  const resultsPromise = supabase.from("results").select("id, title, organization, result_date, status").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);
  const admitCardsPromise = supabase.from("admit_cards").select("id, title, organization, exam_date, status").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);
  const scholarshipsPromise = supabase.from("scholarships").select("id, title, provider, application_deadline, status").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);
  const materialsPromise = supabase.from("prep_materials").select("id, title, type, status, prep_exams(slug)").ilike("title", ilikeQ).eq("status", "PUBLISHED").limit(20);

  const [rpcRes, tendersRes, admissionsRes, resultsRes, admitCardsRes, scholarshipsRes, materialsRes] = await Promise.all([
    rpcPromise, tendersPromise, admissionsPromise, resultsPromise, admitCardsPromise, scholarshipsPromise, materialsPromise
  ]);

  let allResults: any[] = [];

  // Parse RPC results (Legacy + some new Phase 6 prep elements)
  if (rpcRes.data) {
    allResults = rpcRes.data.map((row: any) => ({
      id: row.item_id || row.id, // Fallback depending on RPC structure
      type: row.item_type || row.type,
      title: row.title,
      subtitle: row.subtitle,
      metadata: row.metadata,
      relevanceScore: row.relevance_score || 1
    }));
  }

  // Inject Tenders
  if (tendersRes.data) {
    tendersRes.data.forEach((row: any) => {
      allResults.push({
        id: row.id,
        type: "TENDER",
        title: row.title,
        subtitle: row.department,
        metadata: { closing_date: row.closing_date },
        relevanceScore: 1.2
      });
    });
  }

  // Inject Admissions
  if (admissionsRes.data) {
    admissionsRes.data.forEach((row: any) => {
      allResults.push({
        id: row.id,
        type: "ADMISSION",
        title: row.title,
        subtitle: row.institution,
        metadata: { deadline: row.application_deadline },
        relevanceScore: 1.2
      });
    });
  }

  // Inject Results
  if (resultsRes.data) {
    resultsRes.data.forEach((row: any) => {
      allResults.push({
        id: row.id,
        type: "RESULT",
        title: row.title,
        subtitle: row.organization,
        metadata: { result_date: row.result_date },
        relevanceScore: 1.2
      });
    });
  }

  // Inject Admit Cards
  if (admitCardsRes.data) {
    admitCardsRes.data.forEach((row: any) => {
      allResults.push({
        id: row.id,
        type: "ADMIT_CARD",
        title: row.title,
        subtitle: row.organization,
        metadata: { exam_date: row.exam_date },
        relevanceScore: 1.2
      });
    });
  }

  // Inject Scholarships
  if (scholarshipsRes.data) {
    scholarshipsRes.data.forEach((row: any) => {
      allResults.push({
        id: row.id,
        type: "SCHOLARSHIP",
        title: row.title,
        subtitle: row.provider,
        metadata: { deadline: row.application_deadline },
        relevanceScore: 1.2
      });
    });
  }

  // Inject Study Materials
  if (materialsRes.data) {
    materialsRes.data.forEach((row: any) => {
      allResults.push({
        id: row.id,
        type: "STUDY_MATERIAL",
        title: row.title,
        subtitle: row.type || "Study Material",
        metadata: { exam_slug: row.prep_exams?.slug },
        relevanceScore: 1.2
      });
    });
  }

  // Deduplicate by ID just in case
  const uniqueMap = new Map();
  allResults.forEach(r => uniqueMap.set(r.id, r));
  allResults = Array.from(uniqueMap.values());

  // Sort by relevance score
  allResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Manual pagination
  const totalCount = allResults.length;
  const paginatedResults = allResults.slice(offset, offset + safeLimit);

  return {
    results: paginatedResults,
    totalCount,
    currentPage: safePage,
    pageSize: safeLimit,
    hasNext: (offset + safeLimit) < totalCount,
    hasPrevious: safePage > 1
  };
}
