import os

types_code = """
export type SearchItemType = "JOB" | "EXAM" | "TOPIC" | "MOCK_TEST";

export interface SearchResultMetadata {
  location?: string;
  qualification?: string;
  job_type?: string;
  last_date?: string;
  category?: string;
  slug?: string;
  description?: string;
  chapter_id?: string;
  subject_id?: string;
  exam_id?: string;
  exam_slug?: string;
  duration_minutes?: number;
  total_marks?: number;
}

export interface SearchResultItem {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string;
  metadata: SearchResultMetadata;
  relevanceScore: number;
}
"""

with open("src/lib/search/searchTypes.ts", "w", encoding="utf-8") as f:
    f.write(types_code)

api_code = """
import { supabase } from "@/lib/supabase";
import { SearchResultItem } from "./searchTypes";

export async function executeGlobalSearch(query: string): Promise<SearchResultItem[]> {
  if (!query || !query.trim()) return [];

  const { data, error } = await supabase.rpc("global_discovery_search", {
    search_query: query.trim()
  });

  if (error) {
    console.error("Global search RPC error:", error);
    return [];
  }

  if (!data) return [];

  return data.map((row: any) => ({
    id: row.item_id,
    type: row.item_type,
    title: row.title,
    subtitle: row.subtitle,
    metadata: row.metadata,
    relevanceScore: row.relevance_score
  }));
}
"""

with open("src/lib/search/globalSearch.ts", "w", encoding="utf-8") as f:
    f.write(api_code)
