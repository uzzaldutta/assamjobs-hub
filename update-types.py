import re

with open("src/lib/ingestion/types.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("amount?: string;", "amount?: string;\n  resultDate?: string;\n  eligibility?: string;")

with open("src/lib/ingestion/types.ts", "w", encoding="utf-8") as f:
    f.write(content)
