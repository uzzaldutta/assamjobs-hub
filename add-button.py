with open("src/app/admin/studio/questions/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '<Link href="/admin/studio/questions/import"', 
    '<Link href="/admin/studio/questions/new" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition"><Plus size={16} /> Add Question</Link>\n          <Link href="/admin/studio/questions/import"'
)

with open("src/app/admin/studio/questions/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
