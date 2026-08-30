with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern_mobile = '<Link href="/study-materials" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">Study Materials</Link>'
repl_mobile = '<Link href="/study-materials" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">Study Materials</Link>\n                <Link href="/previous-papers" className="block text-sm font-semibold p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">Question Papers</Link>'

content = content.replace(pattern_mobile, repl_mobile)

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated mobile layout.tsx")
