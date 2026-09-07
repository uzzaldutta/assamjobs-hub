import re

with open("src/app/admin/studio/ingestion/queue/[id]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if 'import QueueActionButtons' not in content:
    content = content.replace(
        'import { approveQueueItemAction, rejectQueueItemAction } from "../../actions";',
        'import QueueActionButtons from "@/components/admin/QueueActionButtons";'
    )

# Remove the inline server actions
pattern_actions = re.compile(r'\s*const handleApprove = async.*?revalidatePath\(\'/admin/studio/ingestion/queue\'\);\s*};\s*const handleReject = async.*?revalidatePath\(\'/admin/studio/ingestion/queue\'\);\s*};\s*', re.DOTALL)
content = pattern_actions.sub('\n', content)
# But wait, [id]/page.tsx didn't have revalidatePath inside the inline functions!
# Let me check what it had. It had:
# const handleApprove = async (formData: FormData) => {
#    "use server";
#    await approveQueueItemAction(item.id, item.payload, item.duplicate_of ? 'UPDATE' : 'NEW');
#  };
#  const handleReject = async (formData: FormData) => {
#    "use server";
#    await rejectQueueItemAction(item.id);
#  };
content = re.sub(r'const handleApprove = async.*?\};\s*const handleReject = async.*?\};\s*', '', content, flags=re.DOTALL)


# Replace the Actions block
# I will replace the whole div that contains the forms.
pattern = re.compile(r'<div className="flex flex-wrap gap-3 mt-4">.*?</div>', re.DOTALL)
# Wait, I don't want to replace all divs with that class, just the one with buttons.
# Let's replace the forms directly with nothing, except we'll inject QueueActionButtons where handleReject was.
# Actually, let's just find the buttons container:
content = re.sub(
    r'\{item\.status !== \'APPROVED\' && item\.status !== \'REJECTED\' && \(\s*<>\s*<form action=\{handleReject\}>.*?</form>\s*<form action=\{handleApprove\}>.*?</form>\s*</>\s*\)\}',
    r"{item.status !== 'APPROVED' && item.status !== 'REJECTED' && (<QueueActionButtons queueId={item.id} payload={item.normalized_payload} duplicateOf={item.duplicate_of} />)}",
    content,
    flags=re.DOTALL
)

# Replace the "Approve" button if it exists separately (wait, there was a second block?)
# Let's check `item.status === 'REJECTED'` block
content = re.sub(
    r'\{item\.status === \'REJECTED\' && \(\s*<form action=\{handleApprove\}>.*?</form>\s*\)\}',
    r"{item.status === 'REJECTED' && (<QueueActionButtons queueId={item.id} payload={item.normalized_payload} duplicateOf={item.duplicate_of} />)}",
    content,
    flags=re.DOTALL
)

# Fix payload var
content = content.replace('item.payload', 'item.normalized_payload')
content = content.replace('const payload = item.normalized_payload || {};', 'const payload = item.normalized_payload || {};')

with open("src/app/admin/studio/ingestion/queue/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed [id] page.tsx completely")
