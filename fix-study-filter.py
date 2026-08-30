import re

with open('src/app/study-materials/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update component signature to extract `subject` searchParam
sig_pattern = r'export default async function StudyMaterialsPage\(\{ searchParams \}: \{ searchParams: Promise<\{ q\?: string \}> \}\) \{'
sig_repl = r'export default async function StudyMaterialsPage({ searchParams }: { searchParams: Promise<{ q?: string, subject?: string }> }) {\n  const { q, subject } = await searchParams;\n  const query = q ? q.toLowerCase() : "";\n  const activeSubject = subject || "ALL";'
content = re.sub(sig_pattern, sig_repl, content)

# 2. Add filtering by subject
filter_pattern = r'(\s*if \(query\) \{\s*data = data\.filter.*?\}\s*)'
filter_repl = r'''\1
      if (activeSubject !== "ALL") {
        data = data.filter((item: any) => item.job_type === activeSubject);
      }
'''
content = re.sub(filter_pattern, filter_repl, content, flags=re.DOTALL)

# 3. Add Category Filter Pills UI
render_pattern = r'(<h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">\s*<BookOpen className="text-blue-500" /> AI Generated Guides\s*</h3>)'

subjects_ui = r'''<div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 w-max">
            <Link href="/study-materials" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>All Subjects</Link>
            <Link href="/study-materials?subject=HISTORY" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'HISTORY' ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>History</Link>
            <Link href="/study-materials?subject=POLITY" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'POLITY' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Polity & Governance</Link>
            <Link href="/study-materials?subject=ECONOMICS" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'ECONOMICS' ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Economics</Link>
            <Link href="/study-materials?subject=GEOGRAPHY" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'GEOGRAPHY' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Geography</Link>
            <Link href="/study-materials?subject=GENERAL_SCIENCE" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'GENERAL_SCIENCE' ? 'bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>General Science</Link>
            <Link href="/study-materials?subject=ASSAM_GK" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'ASSAM_GK' ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Assam GK</Link>
            <Link href="/study-materials?subject=MATH_REASONING" className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeSubject === 'MATH_REASONING' ? 'bg-violet-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Math & Reasoning</Link>
          </div>
        </div>
        
        \1'''
content = re.sub(render_pattern, subjects_ui, content)

# 4. Display the subject tag on the card
card_pattern = r'(<h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">\s*\{mat\.title\}\s*</h3>)'
card_repl = r'''<span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-md mb-3">
                  {mat.type?.replace('_', ' ') || 'STUDY GUIDE'}
                </span>
                \1'''
content = re.sub(card_pattern, card_repl, content)

with open('src/app/study-materials/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
