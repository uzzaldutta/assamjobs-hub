import re

with open('src/app/jobs/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fetch recommended study materials inside the server component
fetch_pattern = r'(let relatedJobs: any\[\] = \[\];)'
fetch_repl = r'''let recommendedMaterials: any[] = [];
  \1'''
content = re.sub(fetch_pattern, fetch_repl, content)

fetch2_pattern = r'(if \(data\) \{\s*relatedJobs = data\.map\(\(j: any\) => \(\{.*?\n\s*\}\)\);\s*\})'
fetch2_repl = r'''\1
    
    // Fetch Recommended Study Materials
    const { data: mats } = await supabase
      .from('jobs')
      .select('id, title, job_type')
      .eq('category', 'STUDY_MATERIAL')
      .order('scraped_at', { ascending: false })
      .limit(10);
      
    if (mats) {
      // Very basic recommendation engine: if job title contains 'police', recommend Assam GK / History. 
      // If banking, recommend Banking. Otherwise, just show generic top 2.
      let keywords = [];
      const titleLower = (job.title || "").toLowerCase();
      
      if (titleLower.includes('police') || titleLower.includes('apsc') || titleLower.includes('assam')) {
        keywords = ['ASSAM_GK', 'HISTORY', 'POLITY'];
      } else if (titleLower.includes('bank') || titleLower.includes('sbi') || titleLower.includes('ibps')) {
        keywords = ['BANKING_AWARENESS', 'MATH_REASONING', 'ENGLISH'];
      } else if (titleLower.includes('medical') || titleLower.includes('dhs') || titleLower.includes('health')) {
        keywords = ['GENERAL_SCIENCE', 'ASSAM_GK'];
      } else {
        keywords = ['HISTORY', 'POLITY', 'GENERAL_SCIENCE', 'MATH_REASONING']; // Default mixed
      }
      
      // Filter materials matching the recommended subjects
      let filteredMats = mats.filter(m => keywords.includes(m.job_type));
      if (filteredMats.length < 2) {
        filteredMats = mats; // Fallback to any recent materials if specific ones aren't found
      }
      recommendedMaterials = filteredMats.slice(0, 2);
    }
'''
content = re.sub(fetch2_pattern, fetch2_repl, content, flags=re.DOTALL)


# 2. Render the recommendations just above DocumentChecklist
render_pattern = r'(<DocumentChecklist />)'
render_repl = r'''{recommendedMaterials.length > 0 && (
          <div className="mt-12 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              Recommended Study Materials for this Exam
            </h3>
            <p className="text-slate-500 text-sm mb-6 relative z-10">Based on the syllabus for this post, we recommend reading these guides:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {recommendedMaterials.map((mat: any) => (
                <Link key={mat.id} href={`/study-materials/${mat.id}`} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-amber-400 hover:bg-white dark:hover:bg-slate-800 transition group">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg group-hover:scale-110 transition-transform shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M18 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2Z"/></svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-1 block">
                      {mat.job_type?.replace('_', ' ') || 'STUDY GUIDE'}
                    </span>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {mat.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-6 text-center relative z-10">
              <Link href="/study-materials" className="text-sm font-bold text-amber-600 dark:text-amber-500 hover:underline">
                View all Study Materials &rarr;
              </Link>
            </div>
          </div>
        )}

        \1'''
content = re.sub(render_pattern, render_repl, content)

with open('src/app/jobs/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
