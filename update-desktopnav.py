with open('src/components/DesktopNav.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

apps_dropdown = """
      {/* Download Apps */}
      <div className="relative group ml-2">
        <button className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 border border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 rounded-full hover:shadow-lg hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300 backdrop-blur-md font-bold">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
          Get Apps
        </button>
        <div className="absolute top-full right-0 mt-3 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-3 translate-y-2 group-hover:translate-y-0">
          
          <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all group/link mb-2 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800">
            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover/link:scale-110 transition-transform shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
            </div>
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">Assam Jobs Hub</div>
              <div className="text-[11px] text-slate-500 font-normal mt-0.5">Get instant job alerts</div>
            </div>
          </a>

          <a href="https://play.google.com/store/apps/details?id=com.ifree.assamesecalendar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-xl transition-all group/link border border-transparent hover:border-orange-100 dark:hover:border-orange-800">
            <div className="bg-orange-100 dark:bg-orange-900/50 p-2.5 rounded-xl text-orange-600 dark:text-orange-400 group-hover/link:scale-110 transition-transform shadow-sm">
              <CalendarDays size={20} />
            </div>
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">Assamese Calendar</div>
              <div className="text-[11px] text-slate-500 font-normal mt-0.5">Track festivals & dates</div>
            </div>
          </a>
          
        </div>
      </div>
    </nav>
"""
content = content.replace('    </nav>', apps_dropdown)

with open('src/components/DesktopNav.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated DesktopNav")
