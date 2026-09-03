import fs

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('import JobCard from "@/components/feeds/JobCard";', 'import JobCard from "@/components/JobCard";')
content = content.replace('data={res} compact={true}', 'result={res}')
content = content.replace('data={adm} compact={true}', 'admitCard={adm}')
content = content.replace('<AdmissionCard key={adm.id} data={adm} compact={true} />', '<AdmissionCard key={adm.id} admission={adm} />')

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
