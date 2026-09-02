with open("src/lib/ingestion/pipeline.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'import { NormalizedPayload, QueueItem, IngestionSource, SourceAdapter } from "./types";',
    'import { NormalizedPayload, QueueItem, IngestionSource } from "./types";\nimport { SourceAdapter } from "./BaseAdapter";'
)

with open("src/lib/ingestion/pipeline.ts", "w", encoding="utf-8") as f:
    f.write(content)
