import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

if '"use server"' not in content:
    content = '"use server";\n\n' + content

content = content.replace('import { supabaseAdmin as supabase } from "@/lib/supabase";', 'import { supabaseAdmin as supabase } from "@/lib/supabase";\nimport { revalidatePath } from "next/cache";')

if "revalidatePath" not in content.split("approveQueueItemAction")[1]:
    content = content.replace("return { success: true };", "revalidatePath('/admin/studio/ingestion/queue');\n  return { success: true };")

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated actions.ts")
