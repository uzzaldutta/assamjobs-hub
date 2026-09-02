import re

with open("src/components/FeedList.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Check if there is an empty state already.
empty_state_html = """
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">No Jobs Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">We couldn't find any jobs matching your criteria. Try adjusting your filters or search term.</p>
            <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setSortBy("latest"); }} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-sm">
              Clear All Filters
            </button>
          </div>
"""

# Usually there's a check `if (filteredJobs.length === 0)` or similar in the render.
# Let's see if we can insert it. We'll just replace the simple "No jobs found" text.

if ">No jobs found" in content or "No jobs matching" in content:
    # We will try a regex to replace the simple div
    content = re.sub(
        r'<div[^>]*>\s*No jobs found.*?</div\s*>',
        empty_state_html,
        content,
        flags=re.IGNORECASE | re.DOTALL
    )
    
with open("src/components/FeedList.tsx", "w", encoding="utf-8") as f:
    f.write(content)
