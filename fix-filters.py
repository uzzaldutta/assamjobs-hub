import os

fixes = {
    "tenders": "q || org || status !== 'ALL'",
    "admissions": "q || inst || course || status !== 'ALL'",
    "results": "q || org || sort !== 'newest'",
    "admit-cards": "q || org || sort !== 'newest'",
    "scholarships": "q || org || status !== 'ALL'"
}

for folder, filter_str in fixes.items():
    filepath = f"src/app/{folder}/page.tsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace('const hasFilters = q || org || status !== "ALL";', f'const hasFilters = {filter_str};')
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Fixed hasFilters!")
