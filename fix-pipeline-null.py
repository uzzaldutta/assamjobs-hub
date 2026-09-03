import re

with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("let applyCol = 'apply_url';", "let applyCol: string | null = 'apply_url';")

with open("src/lib/ingestion/pipeline.ts", "w", encoding="utf-8") as f:
    f.write(content)
