with open('src/components/JobCard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
# Wait, I previously injected it into JobCard like this:
# <span className="text-[9px] md:text-[10px] text-slate-400/80 font-mono" title="Feed ID">\n              ID: {job.id}\n            </span>

pattern_job = r'ID: \{job.id\}'
replacement_job = r'ID: AJH-{job.id.slice(-6).toUpperCase()}'
content = re.sub(pattern_job, replacement_job, content)

with open('src/components/JobCard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/TendersDashboard.tsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

pattern_tender = r'ID: \{tender.id\}'
replacement_tender = r'ID: AJH-{tender.id.slice(-6).toUpperCase()}'
content2 = re.sub(pattern_tender, replacement_tender, content2)

with open('src/components/TendersDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content2)

print("Updated public cards with short alphanumeric ID")
