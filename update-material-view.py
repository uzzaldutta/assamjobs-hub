with open('src/app/study-materials/[materialId]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the Supabase select query
old_query = ".select('title, unique_description, created_at')"
new_query = ".select('title, unique_description, official_pdf_url, created_at')"
content = content.replace(old_query, new_query)

# 2. Add the Download PDF button below the title/date
old_header = """<div className="flex items-center justify-between text-sm text-slate-500 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Published on {new Date(data.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            
            <div className="flex gap-2">"""

new_header = """<div className="flex items-center justify-between text-sm text-slate-500 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Published on {new Date(data.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            
            <div className="flex gap-2">
            {data.official_pdf_url && (
              <a 
                href={data.official_pdf_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                Download PDF
              </a>
            )}"""

content = content.replace(old_header, new_header)

with open('src/app/study-materials/[materialId]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Material view")
