import re

with open("src/app/admin/studio/ingestion/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove the onChange handler
content = content.replace('onChange={(e) => e.target.form?.submit()}', '')

with open("src/app/admin/studio/ingestion/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Removed inline onChange from Server Component")
