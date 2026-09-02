import re

with open("src/lib/ingestion/types.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add CHANGE_DETECTED to IngestionStatus
if "'CHANGE_DETECTED'" not in content:
    content = content.replace("'DUPLICATE_RISK'", "'DUPLICATE_RISK'\n  | 'CHANGE_DETECTED'\n  | 'VERIFICATION_PENDING'")

if "change_diff?: any[];" not in content:
    # insert change_diff into QueueItem
    content = content.replace("validation_warnings: any[];", "validation_warnings: any[];\n  change_diff?: any[];")

# Add tier and is_official to IngestionSource
if "tier: number;" not in content:
    content = content.replace("is_active: boolean;", "is_active: boolean;\n  tier: number;\n  is_official: boolean;\n  feed_type: string;")

with open("src/lib/ingestion/types.ts", "w", encoding="utf-8") as f:
    f.write(content)
