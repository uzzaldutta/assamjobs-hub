import os

files_to_check = [
    "src/app/admin/studio/ingestion/reports/page.tsx",
    "src/app/admin/studio/ingestion/sources/[id]/page.tsx",
    "src/app/admin/studio/gaps/page.tsx",
]

for file_path in files_to_check:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Simple replacement if it wraps a table
    if "<table" in content:
        content = content.replace("overflow-hidden", "overflow-x-auto overflow-y-hidden")
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed {file_path}")

