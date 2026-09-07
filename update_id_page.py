import re

with open("src/app/admin/studio/ingestion/queue/[id]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if 'import QueueActionButtons' not in content:
    content = content.replace(
        'import { approveQueueItemAction, rejectQueueItemAction } from "../../actions";',
        'import QueueActionButtons from "@/components/admin/QueueActionButtons";'
    )

# Replace the Actions block
pattern = re.compile(r'<div className="flex flex-wrap gap-3 mt-4">.*?<form action=\{handleReject\}.*?</form>.*?<form action=\{handleApprove\}.*?</form>.*?</div>', re.DOTALL)
replacement = """<div className="flex flex-wrap gap-3 mt-4">
                <QueueActionButtons queueId={item.id} payload={item.normalized_payload} duplicateOf={item.duplicate_of} />
              </div>"""

content = pattern.sub(replacement, content)

# Remove the inline server actions
pattern_actions = re.compile(r'const handleApprove = async.*?\};\s*const handleReject = async.*?\};\s*', re.DOTALL)
content = pattern_actions.sub('', content)

# Fix payload
content = content.replace('item.payload', 'item.normalized_payload')
content = content.replace('const payload = item.normalized_payload || {};', 'const payload = item.normalized_payload || {};')

with open("src/app/admin/studio/ingestion/queue/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated [id] page.tsx")
