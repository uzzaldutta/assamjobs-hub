import re

with open('src/components/FeedList.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '{/* Filter Pills */}'
# Replace the old pills with the new clean tabs
old_pills_pattern = re.compile(r'\{\/\* Filter Pills \*\/\}.*?\}\)', re.DOTALL)

new_tabs = """{/* Clean Tabs */}
        {!hideFilters && (
          <div className="flex overflow-x-auto hide-scrollbar gap-6 border-b border-slate-200 dark:border-slate-700 mb-6">
            <button 
              onClick={() => handleFilterChange(setFilter, "ALL")}
              className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${filter === "ALL" ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              All
            </button>
            <button 
              onClick={() => handleFilterChange(setFilter, "GOVT")}
              className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${filter === "GOVT" ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              Govt Jobs
            </button>
            <button 
              onClick={() => handleFilterChange(setFilter, "PRIVATE")}
              className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${filter === "PRIVATE" ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              Private Jobs
            </button>
            <button 
              onClick={() => handleFilterChange(setFilter, "EXAM")}
              className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${filter === "EXAM" ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              Exams
            </button>
            <button 
              onClick={() => handleFilterChange(setFilter, "ADMISSION")}
              className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${filter === "ADMISSION" ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              Admissions
            </button>
          </div>
        )}"""

content = old_pills_pattern.sub(new_tabs, content)

with open('src/components/FeedList.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
