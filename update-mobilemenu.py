with open('src/components/MobileMenu.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

pattern = r'\{\/\* App Download \*\/\}\n\s*<div className="pt-4 border-t border-slate-100 dark:border-slate-800">.*?<\/div>'
replacement = """{/* App Download */}
                <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center justify-center gap-2 p-3 bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl font-bold border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm active:scale-95 transition-transform">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-emerald-600"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                    </div>
                    <div className="text-center">
                      <div className="text-[11px] leading-tight">Assam Jobs</div>
                      <div className="text-[9px] font-normal opacity-80 mt-0.5">Get App</div>
                    </div>
                  </a>

                  <a href="https://play.google.com/store/apps/details?id=com.ifree.assamesecalendar" target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center justify-center gap-2 p-3 bg-gradient-to-b from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 text-orange-700 dark:text-orange-400 rounded-2xl font-bold border border-orange-200/50 dark:border-orange-800/50 shadow-sm active:scale-95 transition-transform">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
                      <Calendar size={20} className="text-orange-600" />
                    </div>
                    <div className="text-center">
                      <div className="text-[11px] leading-tight">As Calendar</div>
                      <div className="text-[9px] font-normal opacity-80 mt-0.5">Get App</div>
                    </div>
                  </a>
                </div>"""
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/components/MobileMenu.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MobileMenu")
