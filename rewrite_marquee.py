import re

with open('src/components/RecentMarquee.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace horizontal scroll logic with vertical scroll logic
content = content.replace('el.scrollLeft += 1', 'el.scrollTop += 1')
content = content.replace('el.scrollLeft >= el.scrollWidth / 2', 'el.scrollTop >= el.scrollHeight / 2')
content = content.replace('el.scrollLeft -= el.scrollWidth / 2', 'el.scrollTop -= el.scrollHeight / 2')
content = content.replace('scrollRef.current.scrollLeft = 0', 'scrollRef.current.scrollTop = 0')

# Update the buttons
old_buttons = """<div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('recent')} 
            className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition ${activeTab === 'recent' ? 'bg-emerald-600 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
          >
            <Sparkles size={14} /> Recent
          </button>
          <button 
            onClick={() => setActiveTab('closing')} 
            className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition ${activeTab === 'closing' ? 'bg-red-700 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
          >
            <Clock size={14} /> Closing Soon
          </button>
        </div>"""

new_buttons = """<div className="flex p-1 rounded-xl w-fit gap-2">
          <button 
            onClick={() => setActiveTab('recent')} 
            className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'recent' ? 'bg-emerald-600 shadow-md text-white scale-105 ring-2 ring-emerald-500/30' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'} relative`}
          >
            {activeTab !== 'recent' && <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>}
            <Sparkles size={14} /> Recent
          </button>
          <button 
            onClick={() => setActiveTab('closing')} 
            className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'closing' ? 'bg-red-600 shadow-md text-white scale-105 ring-2 ring-red-500/30' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100'} relative`}
          >
            {activeTab !== 'closing' && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}
            <Clock size={14} /> Closing Soon
          </button>
        </div>"""

content = content.replace(old_buttons, new_buttons)

# Update container classes
content = content.replace(
    'className="flex overflow-x-auto hide-scrollbar relative w-full py-2 touch-pan-x snap-x snap-mandatory"',
    'className="flex flex-col overflow-y-auto hide-scrollbar relative w-full h-[450px] py-2 touch-pan-y snap-y snap-mandatory border-t border-b border-slate-100 dark:border-slate-800"'
)

# Update the map layout classes
content = content.replace(
    'className="flex gap-4 min-w-max pr-4"',
    'className="flex flex-col gap-3 min-h-max pb-3 w-full"'
)

# Update card classes
content = content.replace(
    'className={`relative overflow-hidden w-[300px]',
    'className={`relative overflow-hidden w-full'
)

with open('src/components/RecentMarquee.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
