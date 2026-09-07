import os
import glob

files = glob.glob("src/app/**/[id]/page.tsx", recursive=True)

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We replaced `record.` but the assignment is still `const { data: record }`
    if "data: record" in content:
        if "/jobs/" in path: var = "job"
        elif "/tenders/" in path: var = "tender"
        elif "/admissions/" in path: var = "admission"
        elif "/results/" in path: var = "result"
        elif "/admit-cards/" in path: var = "admitCard"
        elif "/scholarships/" in path: var = "scholarship"
        else: continue
        
        content = content.replace("const { data: record }", f"const {{ data: {var} }}")
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

print("Fixed assignment")
