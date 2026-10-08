import re

with open('src/lib/ingestion/pipeline.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("qualityScore < 50 && finalStatus", "qualityScore < 20 && finalStatus")

with open('src/lib/ingestion/pipeline.ts', 'w', encoding='utf-8') as f:
    f.write(content)