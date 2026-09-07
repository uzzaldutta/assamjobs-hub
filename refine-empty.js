const fs = require('fs');
let content = fs.readFileSync('src/app/jobs/page.tsx', 'utf-8');

const emptyState = `              {(!jobs || jobs.length === 0) && (() => {
                const hasFilters = typeFilter !== "ALL" || query || district || qualification || organization || status !== "ALL";
                return (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Search className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {hasFilters ? "No jobs match these filters." : "No jobs available right now."}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    {hasFilters ? "Try adjusting your filters or search terms." : "Check back later for new opportunities."}
                  </p>
                  {hasFilters && (
                    <Link href="/jobs" className="px-6 py-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 transition-colors">
                      Clear Filters
                    </Link>
                  )}
                </div>
                );
              })()}`;

const start = content.indexOf('{(!jobs || jobs.length === 0) && (');
if (start !== -1) {
    const end = content.indexOf('</div>\r\n              )}', start);
    if (end !== -1) {
        content = content.substring(0, start) + emptyState + content.substring(end + 25);
        fs.writeFileSync('src/app/jobs/page.tsx', content);
        console.log("Replaced successfully!");
    } else {
        const end2 = content.indexOf('</div>\n              )}', start);
        if (end2 !== -1) {
            content = content.substring(0, start) + emptyState + content.substring(end2 + 24);
            fs.writeFileSync('src/app/jobs/page.tsx', content);
            console.log("Replaced successfully!");
        } else {
            console.log("Could not find end marker.");
        }
    }
}
