import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the layout structure
old_layout_start = """          <div className="px-4 md:px-0 relative z-10 grid grid-cols-1 mt-6">
            <RecentMarquee jobs={allJobs} title="Closing Soon" />
            
            {/* 4 Quick Categories */}
            <div className="max-w-7xl mx-auto w-full px-4 my-8">"""

new_layout_start = """          <div className="px-4 relative z-10 max-w-7xl mx-auto w-full mt-6">
            <RecentMarquee jobs={allJobs} title="Closing Soon" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              
              {/* MAIN CONTENT (70%) */}
              <div className="lg:col-span-8 flex flex-col">
                
                {/* 4 Quick Categories */}
                <div className="w-full mb-8">"""

content = content.replace(old_layout_start, new_layout_start)

# Replace the FeedList ending and add Sidebar
old_layout_end = """            <FeedList initialJobs={allJobs} />
          </div>
        </>
      )}
    </div>

  );
}"""

new_layout_end = """            <FeedList initialJobs={allJobs} />
              </div>
              
              {/* SIDEBAR (30%) - FOR ADS AND PROMOS */}
              <aside className="lg:col-span-4 hidden lg:block">
                <div className="sticky top-24 flex flex-col gap-6">
                  
                  {/* AD PLACEHOLDER */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Sponsored Content</span>
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    </div>
                    <h4 className="text-slate-600 dark:text-slate-400 font-bold mb-1">Ad Space Available</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center max-w-[200px]">This premium slot is perfectly optimized for AdSense or direct sponsors.</p>
                  </div>

                  {/* PROMO: AI MOCK TESTS */}
                  <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => window.location.href='/mock-tests/ai-generator'}>
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                    <h4 className="font-black text-lg mb-2 relative z-10 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
                      AI Mock Tests
                    </h4>
                    <p className="text-violet-100 text-sm mb-4 relative z-10 leading-relaxed">Generate realistic 20-question mock tests for APSC, ADRE, and Assam Police instantly.</p>
                    <button className="bg-white text-violet-600 text-sm font-bold px-4 py-2 rounded-lg w-full relative z-10 hover:shadow-md transition-shadow">Try it now &rarr;</button>
                  </div>

                  {/* CTA: WHATSAPP */}
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-6 relative overflow-hidden group cursor-pointer">
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Join Community
                    </h4>
                    <p className="text-emerald-600 dark:text-emerald-500/80 text-sm mb-4 leading-relaxed">Get instant alerts for admit cards, job updates, and results directly on your phone.</p>
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-lg w-full transition-colors shadow-sm">Join WhatsApp Group</button>
                  </div>

                </div>
              </aside>

            </div>
          </div>
        </>
      )}
    </div>

  );
}"""

content = content.replace(old_layout_end, new_layout_end)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated page.tsx layout")
