export const dynamic = "force-dynamic";


import { executeGlobalSearch } from "@/lib/search/globalSearch";
import SearchClient from "./SearchClient";

export const metadata = {
  title: "Search Jobs, Exams, Practice & Mocks | AssamJobs Hub",
  description: "Global unified search for AssamJobs Hub. Find government jobs, syllabus, practice questions, and mock tests instantly.",
  robots: {
    index: false,
    follow: true,
  }
};

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; type?: string; page?: string } }) {
  const query = searchParams.q || "";
  const type = searchParams.type || "";
  const page = parseInt(searchParams.page || "1", 10);
  
  const paginatedData = await executeGlobalSearch(query, page, 20);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 sm:px-6">
      <SearchClient 
        initialQuery={query} 
        initialType={type} 
        paginatedData={paginatedData} 
      />
    </main>
  );
}
