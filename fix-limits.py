import os

files_to_fix = [
    "src/app/page.tsx",
    "src/app/private-jobs/page.tsx"
]

for file in files_to_fix:
    if os.path.exists(file):
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Simply add .limit(30) to the supabase queries.
        content = content.replace(".order('scraped_at', { ascending: false });", ".order('scraped_at', { ascending: false }).limit(40);")
        
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
