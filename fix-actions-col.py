import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("location: payload.location || 'Assam',", "district: payload.location || 'Assam',")

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)
