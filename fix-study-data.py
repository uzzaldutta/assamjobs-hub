import re

with open('src/app/study-materials/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    ".select('id, title, created_at')",
    ".select('id, title, created_at, job_type')"
)

content = content.replace(
    "{mat.type?.replace('_', ' ') || 'STUDY GUIDE'}",
    "{mat.job_type?.replace('_', ' ') || 'STUDY GUIDE'}"
)

# And fix the query filter missing scope (it was inside a comment or wrong place?)
# Wait, I previously tried to inject filter. Let's make sure `aiMaterials` is filtered.
content = content.replace(
    "const { data: aiMaterials } = await supabase",
    "let { data: aiMaterials } = await supabase"
)

filter_inject = r'''
  if (aiMaterials) {
    if (query) {
      aiMaterials = aiMaterials.filter((m: any) => (m.title || "").toLowerCase().includes(query));
    }
    if (activeSubject !== "ALL") {
      aiMaterials = aiMaterials.filter((m: any) => m.job_type === activeSubject);
    }
  }
'''
content = re.sub(r'(\.order\(\'created_at\', \{ ascending: false \}\);)', r'\1' + filter_inject, content)

with open('src/app/study-materials/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
