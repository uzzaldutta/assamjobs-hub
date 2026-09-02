import os

with open("src/app/search/SearchClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Update imports
content = content.replace('import { SearchResultItem } from "@/lib/search/searchTypes";', 'import { SearchResultItem, PaginatedSearchResult } from "@/lib/search/searchTypes";')

# Update component signature
content = content.replace('results: SearchResultItem[]', 'paginatedData: PaginatedSearchResult')

# Inside the component: replace `const jobs = results.filter` with a destructuring
content = content.replace('export default function SearchClient({ initialQuery, initialType, results }: { initialQuery: string; initialType: string; results: SearchResultItem[] }) {', 'export default function SearchClient({ initialQuery, initialType, paginatedData }: { initialQuery: string; initialType: string; paginatedData: PaginatedSearchResult }) {\n  const results = paginatedData.results;')

# Add handlePageChange
page_change_func = """
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/search?${params.toString()}`);
  };
"""
content = content.replace('const setTypeFilter =', page_change_func + '\n  const setTypeFilter =')
content = content.replace('params.delete("type");\n    else params.set("type", type);', 'params.delete("type");\n    else params.set("type", type);\n    params.set("page", "1");')
content = content.replace('params.set("q", query.trim());', 'params.set("q", query.trim());\n    params.set("page", "1");')

# Add Pagination UI below results list
pagination_ui = """
      {paginatedData.totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="text-sm font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900 dark:text-white">{((paginatedData.currentPage - 1) * paginatedData.pageSize) + 1}</span> to <span className="font-bold text-slate-900 dark:text-white">{Math.min(paginatedData.currentPage * paginatedData.pageSize, paginatedData.totalCount)}</span> of <span className="font-bold text-slate-900 dark:text-white">{paginatedData.totalCount}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(paginatedData.currentPage - 1)}
              disabled={!paginatedData.hasPrevious}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => handlePageChange(paginatedData.currentPage + 1)}
              disabled={!paginatedData.hasNext}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
"""
content = content.replace('</div>\n            )}\n          </div>', '</div>\n            )}\n' + pagination_ui + '\n          </div>')

with open("src/app/search/SearchClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)
