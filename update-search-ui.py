import os

with open("src/app/search/page.tsx", "r", encoding="utf-8") as f:
    page = f.read()

page = page.replace('{ q?: string; type?: string; filter?: string }', '{ q?: string; type?: string; filter?: string; page?: string }')
page = page.replace('const results = await executeGlobalSearch(query);', 'const pageNum = parseInt(searchParams.page || "1", 10);\n  const paginatedResults = await executeGlobalSearch(query, pageNum, 20);')
page = page.replace('results={results}', 'paginatedResults={paginatedResults}')

with open("src/app/search/page.tsx", "w", encoding="utf-8") as f:
    f.write(page)

# Update SearchClient.tsx
with open("src/app/search/SearchClient.tsx", "r", encoding="utf-8") as f:
    client = f.read()

client = client.replace('import { SearchResultItem }', 'import { SearchResultItem, PaginatedSearchResult }')
client = client.replace('results: SearchResultItem[]', 'paginatedResults: PaginatedSearchResult')
client = client.replace('const jobs = results.filter', 'const results = paginatedResults.results;\n  const jobs = results.filter')

# Add Pagination UI below results
pagination_ui = """
      {/* Pagination Controls */}
      {paginatedResults.totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="text-sm font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900 dark:text-white">{((paginatedResults.currentPage - 1) * paginatedResults.pageSize) + 1}</span> to <span className="font-bold text-slate-900 dark:text-white">{Math.min(paginatedResults.currentPage * paginatedResults.pageSize, paginatedResults.totalCount)}</span> of <span className="font-bold text-slate-900 dark:text-white">{paginatedResults.totalCount}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(paginatedResults.currentPage - 1)}
              disabled={!paginatedResults.hasPrevious}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => handlePageChange(paginatedResults.currentPage + 1)}
              disabled={!paginatedResults.hasNext}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
"""

client = client.replace('</div>\n            )}\n          </div>', '</div>\n            )}\n' + pagination_ui + '          </div>')

# Add handlePageChange function inside SearchClient
page_change_func = """
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/search?${params.toString()}`);
  };
"""
client = client.replace('const setTypeFilter =', page_change_func + '\n  const setTypeFilter =')
client = client.replace('params.delete("type");\n    else params.set("type", type);', 'params.delete("type");\n    else params.set("type", type);\n    params.set("page", "1"); // Reset page on filter change')
client = client.replace('params.set("q", query.trim());', 'params.set("q", query.trim());\n    params.set("page", "1"); // Reset page on new search')

with open("src/app/search/SearchClient.tsx", "w", encoding="utf-8") as f:
    f.write(client)
