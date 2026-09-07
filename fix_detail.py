import os

file_path = "src/app/admin/studio/ingestion/queue/[id]/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";\n', '')
content = content.replace('import { cookies } from "next/headers";\n', '')

old_actions = """  const approveAction = approveQueueItemAction.bind(null, item.id, item.payload, item.duplicate_of ? 'UPDATE' : 'NEW');
  const rejectAction = rejectQueueItemAction.bind(null, item.id);"""

new_actions = """  const handleApprove = async (formData: FormData) => {
    "use server";
    await approveQueueItemAction(item.id, item.payload, item.duplicate_of ? 'UPDATE' : 'NEW');
  };
  const handleReject = async (formData: FormData) => {
    "use server";
    await rejectQueueItemAction(item.id);
  };"""

content = content.replace(old_actions, new_actions)
content = content.replace('action={rejectAction}', 'action={handleReject}')
content = content.replace('action={approveAction}', 'action={handleApprove}')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
