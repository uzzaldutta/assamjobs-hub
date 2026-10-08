import re

with open('src/lib/ingestion/pipeline.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "calculateSimilarity" in line or "dupCheck" in line or "duplicate" in line.lower():
        print(f"Line {i}: {line.strip()}")