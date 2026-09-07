import os
import glob
import re

files = glob.glob("src/app/**/page.tsx", recursive=True)

for path in files:
    path = path.replace("\\", "/")
    
    if "/jobs/" in path: continue # jobs used `job` correctly
    
    if "/tenders/" in path or "/admissions/" in path or "/results/" in path or "/admit-cards/" in path or "/scholarships/" in path:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # We changed `const { data: record }` to `const { data: tender }` etc.
        # We should just blindly change it back to `record` in these files!
        var = ""
        if "/tenders/" in path: var = "tender"
        elif "/admissions/" in path: var = "admission"
        elif "/results/" in path: var = "result"
        elif "/admit-cards/" in path: var = "admitCard"
        elif "/scholarships/" in path: var = "scholarship"
        
        # Replace `tender` back to `record`
        content = content.replace(f"data: {var}", "data: record")
        content = content.replace(f"!{var} || {var}.status", "!record || record.status")
        content = content.replace(f"{var}.organization", "record.organization")
        content = content.replace(f"{var}.institution", "record.institution")
        content = content.replace(f"{var}.title", "record.title")
        content = content.replace(f"{var}.id", "record.id")
        content = content.replace(f"{var}?.title", "record?.title")
        content = content.replace(f"{var}?.organization", "record?.organization")
        content = content.replace(f"{var}?.institution", "record?.institution")
        content = content.replace(f"{var}?.id", "record?.id")
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

print("Reverted to record for non-jobs")
