import re

with open('src/lib/ingestion/types.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "eligibility?: string;",
    "eligibility?: string;\n  age_limit?: string;\n  application_fee?: string;\n  selection_process?: string;\n  unique_description?: string;\n  unique_description_assamese?: string;"
)

with open('src/lib/ingestion/types.ts', 'w', encoding='utf-8') as f:
    f.write(content)