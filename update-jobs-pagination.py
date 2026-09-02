import os

with open("src/app/govt-jobs/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the component signature and supabase query
import re

new_func = """
export default async function GovtJobsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let jobs: any[] = [];
  let totalCount = 0;
  
  try {
    const { data, count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .neq('category', 'BANNED_KEYWORD')
      .eq('job_type', 'GOVERNMENT')
      .order('scraped_at', { ascending: false })
      .range(from, to);
      
    totalCount = count || 0;
    
    if (data) {
      jobs = data.map(job => ({
        ...job,
        type: job.job_type,
        lastDate: job.last_date,
        officialUrl: job.official_pdf_url || job.apply_url,
        createdAt: new Date(job.scraped_at || job.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      }));
    }
  } catch(e) {
    console.error("Could not load from Supabase", e);
  }

  // Deduplication and spam filtering applied to current page
  jobs = deduplicateJobs(jobs);

  const spamKeywords = ["bio-data maker", "scheme", "merit award", "scholarship", "whatsapp group", "telegram", "join our"];
  jobs = jobs.filter(job => {
    if (!job.title) return false;
    const lowerTitle = job.title.toLowerCase();
    return !spamKeywords.some(keyword => lowerTitle.includes(keyword));
  });

  const totalPages = Math.ceil(totalCount / limit);
"""

content = re.sub(r'export default async function GovtJobsPage.*?const spamKeywords.*?\}\);', new_func, content, flags=re.DOTALL)

# Now add Pagination UI below FeedList
pagination_ui = """
            <FeedList initialJobs={jobs} defaultFilter="GOVERNMENT" hideFilters={true} />
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                 <div className="text-sm font-medium text-slate-500">
                    Page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
                 </div>
                 <div className="flex gap-2">
                    {page > 1 ? (
                      <a href={`/govt-jobs?page=${page - 1}`} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors">Previous</a>
                    ) : (
                      <button disabled className="px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 rounded-lg text-sm font-bold opacity-50 cursor-not-allowed">Previous</button>
                    )}
                    
                    {page < totalPages ? (
                      <a href={`/govt-jobs?page=${page + 1}`} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-bold transition-colors">Next</a>
                    ) : (
                      <button disabled className="px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 rounded-lg text-sm font-bold opacity-50 cursor-not-allowed">Next</button>
                    )}
                 </div>
              </div>
            )}
"""

content = content.replace('<FeedList initialJobs={jobs} defaultFilter="GOVERNMENT" hideFilters={true} />', pagination_ui)

with open("src/app/govt-jobs/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
