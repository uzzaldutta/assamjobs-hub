with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = '<Link href="/study-materials" className="text-sm font-semibold hover:text-indigo-600 transition">Study Materials</Link>'
repl = '<Link href="/study-materials" className="text-sm font-semibold hover:text-indigo-600 transition">Study Materials</Link>\n              <Link href="/previous-papers" className="text-sm font-semibold hover:text-indigo-600 transition">Question Papers</Link>'

content = content.replace(pattern, repl)

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated layout.tsx")
