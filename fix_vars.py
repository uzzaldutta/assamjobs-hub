import os
import re

# Fix jobs
with open("src/app/jobs/[id]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("record.title", "job.title").replace("record.organization", "job.organization").replace("record.id", "job.id")
with open("src/app/jobs/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

# Fix mock tests
with open("src/app/mock-tests/[testId]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("test?.title || material?.title", "test?.title").replace("test?.id || material?.id", "test?.id")
# Fix missing description
content = content.replace("twitter: { card: 'summary_large_image', title, description }", "twitter: { card: 'summary_large_image', title, description: desc }")
content = content.replace("openGraph: { title, description, url, type: 'article' }", "openGraph: { title, description: desc, url, type: 'article' }")
with open("src/app/mock-tests/[testId]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

# Fix study materials
with open("src/app/study-materials/[materialId]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("test?.title || material?.title", "material?.title").replace("test?.id || material?.id", "material?.id")
content = content.replace("twitter: { card: 'summary_large_image', title, description }", "twitter: { card: 'summary_large_image', title, description: desc }")
content = content.replace("openGraph: { title, description, url, type: 'article' }", "openGraph: { title, description: desc, url, type: 'article' }")
with open("src/app/study-materials/[materialId]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

# Also fix tenders, admissions, results, admit-cards, scholarships
def fix_var(path, var):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We injected `record` in JSON-LD but the component uses `tender`, `admission`, etc.
    # We should just regex replace `record.` with `var.` inside the return statement JSON-LD block
    # Or just replace `record.` globally since `record` is only in generateMetadata. Oh wait, generateMetadata uses `record`!
    # So we ONLY want to replace `record.` inside the JSX!
    # A safe way: `name": record.` -> `name": var.`
    
    content = content.replace('"name": record.title', f'"name": {var}?.title')
    content = content.replace('by ${record.organization}', f'by ${{{var}?.organization}}')
    content = content.replace('by ${record.institution}', f'by ${{{var}?.institution}}')
    content = content.replace('Details for ${record.title}', f'Details for ${{{var}?.title}}')
    content = content.replace('${record.id}', f'${{{var}?.id}}')
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

fix_var("src/app/tenders/[id]/page.tsx", "tender")
fix_var("src/app/admissions/[id]/page.tsx", "admission")
fix_var("src/app/results/[id]/page.tsx", "result")
fix_var("src/app/admit-cards/[id]/page.tsx", "admitCard")
fix_var("src/app/scholarships/[id]/page.tsx", "scholarship")

print("Fixed var refs")
