
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
