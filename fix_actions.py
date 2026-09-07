import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Change function signature
content = content.replace(
    "export async function approveQueueItemAction(queueId: string, payload: any, action: 'NEW' | 'UPDATE' = 'NEW') {",
    "export async function approveQueueItemAction(queueId: string, action: 'NEW' | 'UPDATE' = 'NEW') {\n  // 1. Fetch queue item\n  const { data: item } = await supabase.from('ingestion_queue').select('*').eq('id', queueId).single();\n  if (!item) throw new Error(\"Queue item not found\");\n  const payload = item.normalized_payload;\n"
)

# Remove the original fetch since we added it to the signature replacement
content = content.replace(
    "  // 1. Fetch queue item\n  const { data: item } = await supabase.from('ingestion_queue').select('*').eq('id', queueId).single();\n  if (!item) throw new Error(\"Queue item not found\");\n\n  const { data: sourceMeta }",
    "  const { data: sourceMeta }"
)

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("actions.ts modified")
