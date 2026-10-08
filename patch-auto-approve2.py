import re

with open('src/lib/ingestion/pipeline.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "if (qItem && finalStatus === 'NEW' && qualityScore >= 40) {",
    "if (qItem && finalStatus === 'NEW' && qualityScore >= 20) {"
)

with open('src/lib/ingestion/pipeline.ts', 'w', encoding='utf-8') as f:
    f.write(content)