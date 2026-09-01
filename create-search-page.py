import os

os.makedirs("src/app/search", exist_ok=True)

page_code = """
import { supabase } from "@/lib/supabase";
import SearchClient from "./SearchClient";
import DiscoveryLanding from "./DiscoveryLanding";

export const metadata = {
  title: "Search | AssamJobs Hub",
  description: "Discover jobs, exams, practice questions, and study materials on AssamJobs Hub.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; filter?: string };
}) {
  const query = searchParams.q?.trim();
  const typeFilter = searchParams.type?.toUpperCase() || "ALL";

  // 1. No Query State: Show the Discovery Landing Page
  if (!query) {
    return <DiscoveryLanding />;
  }

  // 2. Fetch Results using the custom RPC
  // Since this is a server component, this execution is lightning fast and hidden from the browser.
  const { data: results, error } = await supabase.rpc("global_discovery_search", {
    search_query: query,
  });

  if (error) {
    console.error("Search RPC Error:", error);
    // Silent fail to empty results, handled by UI
  }

  const safeResults = results || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <SearchClient 
          initialQuery={query} 
          initialType={typeFilter}
          results={safeResults} 
        />
      </main>
    </div>
  );
}
"""

with open("src/app/search/page.tsx", "w", encoding="utf-8") as f:
    f.write(page_code)
