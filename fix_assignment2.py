import os
import glob
import re

files = glob.glob("src/app/**/page.tsx", recursive=True)

for path in files:
    path = path.replace("\\", "/") # Normalize for easy matching
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "data: record" in content:
        print(f"Fixing {path}")
        if "/jobs/" in path: var = "job"
        elif "/tenders/" in path: var = "tender"
        elif "/admissions/" in path: var = "admission"
        elif "/results/" in path: var = "result"
        elif "/admit-cards/" in path: var = "admitCard"
        elif "/scholarships/" in path: var = "scholarship"
        else: continue
        
        content = content.replace("data: record", f"data: {var}")
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

print("Fixed assignment completely")
