with open("src/app/admin/studio/generator/GeneratorClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'const [hierarchy, setHierarchy] = useState({ exams: [], subjects: [], chapters: [], topics: [] });',
    'const [hierarchy, setHierarchy] = useState<{ exams: any[]; subjects: any[]; chapters: any[]; topics: any[] }>({ exams: [], subjects: [], chapters: [], topics: [] });'
)

with open("src/app/admin/studio/generator/GeneratorClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)
