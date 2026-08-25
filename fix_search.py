import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update component signature
content = content.replace(
    'export default async function Home() {',
    'export default async function Home({ searchParams }: { searchParams?: { search?: string } }) {\n  const searchQuery = searchParams?.search;\n'
)

# 2. Add search filter logic
filter_logic = """
  // Apply Search Filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    allJobs = allJobs.filter(job => 
      (job.title && job.title.toLowerCase().includes(q)) || 
      (job.organization && job.organization.toLowerCase().includes(q)) ||
      (job.district && job.district.toLowerCase().includes(q))
    );
  }
"""

content = content.replace('  return (', filter_logic + '\n  return (')

# 3. Modify JSX to handle search mode
# Find the start of the return statement
return_index = content.find('  return (')

jsx_start = content.find('<div className="flex flex-col min-h-screen">', return_index)
jsx_end = content.rfind('</div>')

# We want to conditionally render the Hero/Categories/Marquee if there's NO search query
search_jsx = """
    <div className="flex flex-col min-h-screen">
      {searchQuery ? (
        <div className="px-4 py-12 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4">
              &larr; Back to Home
            </Link>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
              Search Results for <span className="text-blue-600">"{searchQuery}"</span>
            </h2>
            <p className="text-slate-500 mt-2">Found {allJobs.length} matching opportunities</p>
          </div>
          
          {allJobs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No results found</h3>
              <p className="text-slate-500">Try adjusting your search terms or browsing categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="px-4 md:px-6 relative z-10">
            <HeroSection />
          </div>

          <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 mt-6">
            <RecentMarquee jobs={allJobs} title="Closing Soon" />
            
            {/* 4 Quick Categories */}
            <div className="max-w-7xl mx-auto w-full px-4 my-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/?filter=GOVERNMENT" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">Govt Jobs</h3>
                </Link>
                <Link href="/?filter=PRIVATE" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md hover:indigo-300 transition-all text-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">Private Jobs</h3>
                </Link>
                <Link href="/admissions" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md hover:emerald-300 transition-all text-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">Admissions</h3>
                </Link>
                <Link href="/admit-cards" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md hover:purple-300 transition-all text-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">Exams</h3>
                </Link>
              </div>
            </div>

            <FeedList initialJobs={allJobs} />
          </div>
        </>
      )}
    </div>
"""

# Replace the JSX entirely
content = content[:jsx_start] + search_jsx + content[jsx_end + 6:]

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
