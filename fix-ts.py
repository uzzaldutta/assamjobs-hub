with open("src/app/admin/studio/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'const token = cookies().get("admin_token")?.value;',
    'const cookieStore = await cookies();\n  const token = cookieStore.get("admin_token")?.value;'
)
content = content.replace('function verifyAdmin()', 'async function verifyAdmin()')
content = content.replace('verifyAdmin();', 'await verifyAdmin();')

with open("src/app/admin/studio/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)

with open("src/app/admin/studio/questions/new/QuestionEditorClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'const [hierarchy, setHierarchy] = useState({ exams: [], subjects: [], chapters: [], topics: [] });',
    'const [hierarchy, setHierarchy] = useState<{ exams: any[]; subjects: any[]; chapters: any[]; topics: any[] }>({ exams: [], subjects: [], chapters: [], topics: [] });'
)

with open("src/app/admin/studio/questions/new/QuestionEditorClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)
