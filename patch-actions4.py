import re

with open('src/app/admin/studio/ingestion/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update actions.ts to map unique_description and unique_description_assamese properly
replacement = """official_source_url: payload.sourceUrl || null,
          unique_description: payload.unique_description || payload.description || null,
          unique_description_assamese: payload.unique_description_assamese || null"""

content = re.sub(r'official_source_url:\s*payload\.sourceUrl\s*\|\|\s*null,\s*unique_description:\s*payload\.description\s*\|\|\s*null', replacement, content)

with open('src/app/admin/studio/ingestion/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)