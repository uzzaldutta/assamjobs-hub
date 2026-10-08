import re

with open('src/app/admin/studio/ingestion/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING',
          unique_description: payload.unique_description || payload.description || null,
          unique_description_assamese: payload.unique_description_assamese || null"""

content = re.sub(r"verification_status:\s*sourceMeta\?\.is_official\s*\?\s*'VERIFIED'\s*:\s*'VERIFICATION_PENDING',\s*unique_description:\s*payload\.description\s*\|\|\s*null", replacement, content)

with open('src/app/admin/studio/ingestion/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)