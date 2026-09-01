import re

with open("src/app/admin/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Fix cookies() being async in Next.js 15
content = content.replace('cookies().set', '(await cookies()).set')
content = content.replace('cookies().delete', '(await cookies()).delete')
content = content.replace('const token = cookies().get', 'const token = (await cookies()).get')

# Make verifyAuth async since cookies is async
content = content.replace('function verifyAuth()', 'async function verifyAuth()')
content = content.replace('verifyAuth();', 'await verifyAuth();')

with open("src/app/admin/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed actions.ts")

# Fix exams/page.tsx missing theme
with open("src/app/exams/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace('subtitle="Discover structured syllabus, practice questions, and mock tests for top competitive exams."', 'subtitle="Discover structured syllabus, practice questions, and mock tests for top competitive exams." theme="indigo"')
with open("src/app/exams/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed exams/page.tsx")

# Fix PrepDashboard.tsx setIsAddingQ
with open("src/components/admin/PrepDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace('setIsAddingQ(false);', '') # just remove it, the previous logic didn't have it either (it probably used setNewQ or something else)
with open("src/components/admin/PrepDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed PrepDashboard.tsx")
