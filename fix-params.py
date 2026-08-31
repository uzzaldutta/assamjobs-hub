with open('src/app/study-materials/[materialId]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'export default async function StudyMaterialView({ params }: { params: { materialId: string } }) {',
    'export default async function StudyMaterialView({ params }: { params: Promise<{ materialId: string }> }) {\n  const resolvedParams = await params;'
)

content = content.replace(
    ".eq('id', params.materialId)",
    ".eq('id', resolvedParams.materialId)"
)

with open('src/app/study-materials/[materialId]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed dynamic route params Promise bug")
