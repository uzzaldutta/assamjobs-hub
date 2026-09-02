import re

with open("src/lib/ingestion/types.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add estimatedValue to NormalizedPayload
if "estimatedValue?:" not in content:
    content = content.replace("vacancy?: string;", "vacancy?: string;\n  estimatedValue?: string;\n  department?: string;\n  tenderNumber?: string;\n  course?: string;\n  examName?: string;")

with open("src/lib/ingestion/types.ts", "w", encoding="utf-8") as f:
    f.write(content)
