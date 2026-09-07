import os
import glob
import re

files = glob.glob("src/app/**/page.tsx", recursive=True)

for path in files:
    path = path.replace("\\", "/")
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We replaced `const { data: record }` with `const { data: var }`
    # Now we must replace `if (!record || record.status !== 'PUBLISHED')` with `if (!var || var.status !== 'PUBLISHED')`
    # Also if there are other `record.` references INSIDE generateMetadata.
    
    if "!record || record.status" in content:
        if "/jobs/" in path: var = "job"
        elif "/tenders/" in path: var = "tender"
        elif "/admissions/" in path: var = "admission"
        elif "/results/" in path: var = "result"
        elif "/admit-cards/" in path: var = "admitCard"
        elif "/scholarships/" in path: var = "scholarship"
        else: continue
        
        content = content.replace("!record || record.status", f"!{var} || {var}.status")
        # Also fix any remaining `record.` in the file that was missed because it was only in generateMetadata!
        content = content.replace("record.organization", f"{var}.organization")
        content = content.replace("record.title", f"{var}.title")
        content = content.replace("record.id", f"{var}.id")
        content = content.replace("record.institution", f"{var}.institution")
        
        # In case the file ALREADY used `record` for something else (like related_records), we should be careful. 
        # But wait, looking at the TS errors:
        # src/app/results/[id]/page.tsx(148,73): error TS2304: Cannot find name 'record'.
        # Oh! `results/[id]/page.tsx` was using `record` for OTHER things, and my `fix_vars.py` regex `content.replace('record.', f'{var}.')` broke it! Wait, I didn't do `record.` I did `content.replace('by ${record.organization}', ...)`
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

print("Fixed record conditionals")
