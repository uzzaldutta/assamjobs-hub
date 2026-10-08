import re

with open('src/app/admin/studio/ingestion/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """        category: payload.category || 'OTHER',
        vacancies: payload.vacancy || 'Not Specified',
        district: payload.location || 'Assam',
        qualification: payload.qualification || null,
        age_limit: payload.age_limit || null,
        application_fee: payload.application_fee || null,
        selection_process: payload.selection_process || null,
        last_date: payload.applicationEnd || null,"""

content = re.sub(
    r"category: payload\.category \|\| 'OTHER',\s*vacancies: payload\.vacancy \|\| 'Not Specified',\s*district: payload\.location \|\| 'Assam',\s*last_date: payload\.applicationEnd \|\| null,",
    replacement,
    content,
    flags=re.DOTALL
)

with open('src/app/admin/studio/ingestion/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)