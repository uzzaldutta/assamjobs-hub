import re

with open("src/lib/ingestion/types.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add distinct link fields
if "notificationUrl?:" not in content:
    content = content.replace("sourceUrl?: string;", "sourceUrl?: string;\n  notificationUrl?: string;\n  applyUrl?: string;")

with open("src/lib/ingestion/types.ts", "w", encoding="utf-8") as f:
    f.write(content)
