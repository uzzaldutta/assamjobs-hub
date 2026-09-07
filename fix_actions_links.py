import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Fix apply_url and official_source_url mappings for JOBS
content = content.replace("apply_url: payload.applyUrl || payload.sourceUrl,", "apply_url: payload.applyUrl || null,")
content = content.replace("official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null", "official_source_url: payload.sourceUrl || null")

# Fix TENDERS
content = content.replace("official_source_url: sourceMeta?.is_official ? payload.sourceUrl : null,", "official_source_url: payload.sourceUrl || null,")

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated actions.ts for link mapping")
