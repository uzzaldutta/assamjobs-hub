api = """import { supabase } from "@/lib/supabase";
import { SearchResultItem, PaginatedSearchResult } from "./searchTypes";

export async function executeGlobalSearch(query: string, page: number = 1, limit: number = 20): Promise<PaginatedSearchResult> {
  const safeLimit = Math.min(Math.max(limit, 1), 50); // Enforce max 50
  const safePage = Math.max(page, 1);
  const offset = (safePage - 1) * safeLimit;

  if (!query || !query.trim()) return { results: [], totalCount: 0, currentPage: safePage, pageSize: safeLimit, hasNext: false, hasPrevious: false };

  const { data, error } = await supabase.rpc("global_discovery_search", {
    search_query: query.trim(),
    limit_val: safeLimit,
    offset_val: offset
  });

  if (error) {
    console.error("Global search RPC error:", error);
    return { results: [], totalCount: 0, currentPage: safePage, pageSize: safeLimit, hasNext: false, hasPrevious: false };
  }

  if (!data || data.length === 0) {
    return { results: [], totalCount: 0, currentPage: safePage, pageSize: safeLimit, hasNext: false, hasPrevious: false };
  }

  // total_count is attached to every row by the window function
  const totalCount = parseInt(data[0].total_count || "0", 10);
  
  const results = data.map((row: any) => ({
    id: row.item_id,
    type: row.item_type,
    title: row.title,
    subtitle: row.subtitle,
    metadata: row.metadata,
    relevanceScore: row.relevance_score
  }));

  return {
    results,
    totalCount,
    currentPage: safePage,
    pageSize: safeLimit,
    hasNext: (offset + safeLimit) < totalCount,
    hasPrevious: safePage > 1
  };
}
"""

with open("src/lib/search/globalSearch.ts", "w", encoding="utf-8") as f:
    f.write(api)
