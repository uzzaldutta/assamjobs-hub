import re

with open('src/app/admin/studio/ingestion/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r"(export async function approveQueueItemAction.*?^})", content, re.MULTILINE | re.DOTALL)
if match:
    print(match.group(1))