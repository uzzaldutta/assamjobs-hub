import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

# I likely messed up a brace in the replacement. Let me check the file.
print(content[-500:])
