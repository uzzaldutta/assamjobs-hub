import re

with open('src/lib/ingestion/gemini-rewriter.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Website Text:\n      \\", "Website Text:\n      ${rawText.substring(0, 15000)}")

with open('src/lib/ingestion/gemini-rewriter.ts', 'w', encoding='utf-8') as f:
    f.write(content)