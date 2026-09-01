import os

page_code = """
import SearchClient from "./SearchClient";
import DiscoveryLanding from "./DiscoveryLanding";
import { executeGlobalSearch } from "@/lib/search/globalSearch";

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

  if (!query) {
    return <DiscoveryLanding />;
  }

  // 1. Fetch results via abstracted service
  const results = await executeGlobalSearch(query);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <SearchClient 
          initialQuery={query} 
          initialType={typeFilter}
          results={results} 
        />
      </main>
    </div>
  );
}
"""

with open("src/app/search/page.tsx", "w", encoding="utf-8") as f:
    f.write(page_code)
