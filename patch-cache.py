import re

with open('src/app/admin/studio/ingestion/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "revalidatePath('/admin/studio/ingestion/queue');",
    "revalidatePath('/admin/studio/ingestion/queue');\n  revalidatePath('/', 'layout');"
)

with open('src/app/admin/studio/ingestion/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)