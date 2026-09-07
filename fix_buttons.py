import re

with open("src/components/admin/QueueActionButtons.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "const res = await approveQueueItemAction(queueId, payload, duplicateOf ? 'UPDATE' : 'NEW');",
    "const res = await approveQueueItemAction(queueId, duplicateOf ? 'UPDATE' : 'NEW');"
)

with open("src/components/admin/QueueActionButtons.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("QueueActionButtons modified")
