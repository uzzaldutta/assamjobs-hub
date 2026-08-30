import re

with open('src/app/study-materials/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Signature
content = re.sub(
    r'export default async function StudyMaterialsLibrary\(\) \{',
    r'export default async function StudyMaterialsLibrary({ searchParams }: { searchParams: Promise<{ q?: string, subject?: string }> }) {\n  const { q, subject } = await searchParams;\n  const query = q ? q.toLowerCase() : "";\n  const activeSubject = subject || "ALL";',
    content
)

with open('src/app/study-materials/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
