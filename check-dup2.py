import re

with open('src/lib/ingestion/pipeline.ts', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'(static async detectDuplicates.*?^  })', content, re.MULTILINE | re.DOTALL)
if match:
    print(match.group(1))