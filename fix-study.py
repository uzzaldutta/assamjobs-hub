import re

with open('src/app/study-materials/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the signature to accept searchParams
sig_pattern = r'export default async function StudyMaterialsPage\(\) \{'
sig_repl = r'export default async function StudyMaterialsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {\n  const { q } = await searchParams;\n  const query = q ? q.toLowerCase() : "";'
content = re.sub(sig_pattern, sig_repl, content)

# 2. Add filtering to aiMaterials
filter_pattern = r'(let aiMaterials: any\[\] = \[\];\s*let manualPdfs: any\[\] = \[\];\s*try \{.*?if \(data\) \{)'
filter_repl = r'''\1
      // Server-side search filtering
      if (query) {
        data = data.filter((item: any) => 
          (item.title && item.title.toLowerCase().includes(query)) || 
          (item.organization && item.organization.toLowerCase().includes(query))
        );
      }
'''
content = re.sub(filter_pattern, filter_repl, content, flags=re.DOTALL)

# 3. Add the search bar UI above the AI materials section
render_pattern = r'(<h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">\s*<BookOpen className="text-blue-500" /> AI Generated Guides\s*</h3>)'
render_repl = r'''<form action="/study-materials" method="GET" className="mb-8 relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            name="q" 
            defaultValue={query} 
            placeholder="Search study materials by exam or topic..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button type="submit" className="absolute right-2 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg font-bold text-sm">Search</button>
        </form>

        \1'''
content = re.sub(render_pattern, render_repl, content)

with open('src/app/study-materials/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
