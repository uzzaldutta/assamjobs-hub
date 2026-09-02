with open("src/app/admin/studio/materials/new/NewMaterialClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'const [hierarchy, setHierarchy] = useState({ exams: [], subjects: [], topics: [] });',
    'const [hierarchy, setHierarchy] = useState<{ exams: any[]; subjects: any[]; topics: any[] }>({ exams: [], subjects: [], topics: [] });'
)

with open("src/app/admin/studio/materials/new/NewMaterialClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)
