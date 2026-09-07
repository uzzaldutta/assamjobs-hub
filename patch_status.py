import os

files_to_patch = [
    {"path": "src/app/jobs/[id]/page.tsx", "var": "job"},
    {"path": "src/app/tenders/[id]/page.tsx", "var": "tender"},
    {"path": "src/app/admissions/[id]/page.tsx", "var": "admission"},
    {"path": "src/app/results/[id]/page.tsx", "var": "result"},
    {"path": "src/app/admit-cards/[id]/page.tsx", "var": "admitCard"},
    {"path": "src/app/scholarships/[id]/page.tsx", "var": "scholarship"},
]

for item in files_to_patch:
    if not os.path.exists(item["path"]):
        continue
    with open(item["path"], "r", encoding="utf-8") as f:
        content = f.read()
    
    # Simple replacement:
    old_str = f"if (error || !{item['var']}) {{"
    new_str = f"if (error || !{item['var']} || {item['var']}.status !== 'PUBLISHED') {{"
    
    if new_str not in content:
        content = content.replace(old_str, new_str)
        with open(item["path"], "w", encoding="utf-8") as f:
            f.write(content)

print("Enforced published status check.")
