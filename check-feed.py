with open("src/components/FeedList.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Let's add an empty state if it's just 'No jobs found'
empty_state = """<div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
        <Search className="text-slate-400" size={40} />
      </div>
      <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">No jobs found</h3>
      <p className="text-slate-500 max-w-md mx-auto">We couldn't find any jobs matching your current filters. Try adjusting your search criteria.</p>
    </div>"""

# Replace a basic "No jobs found" if it exists, or inject it
if ">No jobs found<" in content:
    # simple replacement if it's already there
    pass 
else:
    print("Not found exactly, leaving it alone or it might already have one.")
