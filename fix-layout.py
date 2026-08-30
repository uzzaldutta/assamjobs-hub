import re

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'<button className="hidden lg:flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 w-10 h-10 rounded-full transition-colors">\s*<svg.*?</svg>\s*</button>', re.DOTALL)

replacement = r'''<Link href="/search" className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 w-10 h-10 rounded-full transition-colors" aria-label="Search">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </Link>'''

content = pattern.sub(replacement, content)

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced button with Link in layout.tsx")
