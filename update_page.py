import re

with open("src/app/admin/studio/ingestion/queue/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if 'import QueueActionButtons' not in content:
    content = content.replace(
        'import { approveQueueItemAction, rejectQueueItemAction } from "../actions";',
        'import QueueActionButtons from "@/components/admin/QueueActionButtons";'
    )

# Replace the Actions div
pattern = re.compile(r'\{\/\* Actions \*\/.*?<form action=\{handleReject\}.*?</form>.*?<form action=\{handleApprove\}.*?</form>.*?</div>\s*\)\}\s*</div>', re.DOTALL)
replacement = """{/* Actions */}
                <div className="w-full md:w-auto shrink-0 flex flex-row md:flex-col gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 justify-end">
                  <Link href={`/admin/studio/ingestion/queue/${item.id}`} className="text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg flex justify-center items-center gap-1 transition flex-1 md:flex-none">
                    <FileSearch size={14}/> Inspect Details
                  </Link>
                  
                  {(currentStatus === 'PENDING' || ['NEW', 'CHANGE_DETECTED', 'DUPLICATE_RISK'].includes(item.status)) && (
                    <QueueActionButtons queueId={item.id} payload={item.normalized_payload} duplicateOf={item.duplicate_of} />
                  )}
                </div>"""

content = pattern.sub(replacement, content)

# Remove the inline server actions
pattern_actions = re.compile(r'const handleApprove = async.*?revalidatePath\(\'/admin/studio/ingestion/queue\'\);\s*};\s*const handleReject = async.*?revalidatePath\(\'/admin/studio/ingestion/queue\'\);\s*};\s*', re.DOTALL)
content = pattern_actions.sub('', content)

# Also fix the `item.payload` reference in the rest of the loop to `item.normalized_payload`
content = content.replace('const payload = item.payload || {};', 'const payload = item.normalized_payload || {};')
# Wait, let's see how payload is extracted in page.tsx
if 'item.payload' in content:
    content = content.replace('item.payload', 'item.normalized_payload')


with open("src/app/admin/studio/ingestion/queue/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated page.tsx")
