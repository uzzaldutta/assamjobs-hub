import re

with open("src/app/api/cron/ingestion/route.ts", "r", encoding="utf-8") as f:
    content = f.read()

if 'IndGovtJobsAdapter' not in content:
    content = content.replace(
        "import { GenericAggregatorAdapter } from '@/lib/ingestion/adapters/GenericAggregatorAdapter';",
        "import { GenericAggregatorAdapter } from '@/lib/ingestion/adapters/GenericAggregatorAdapter';\nimport { IndGovtJobsAdapter } from '@/lib/ingestion/adapters/IndGovtJobsAdapter';"
    )
    content = content.replace(
        "else if (source.adapter_name === 'GenericAggregatorAdapter') adapterInstance = new GenericAggregatorAdapter(source);",
        "else if (source.adapter_name === 'GenericAggregatorAdapter') adapterInstance = new GenericAggregatorAdapter(source);\n        else if (source.adapter_name === 'IndGovtJobsAdapter') adapterInstance = new IndGovtJobsAdapter(source);"
    )
    with open("src/app/api/cron/ingestion/route.ts", "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated cron route")
else:
    print("Already in cron route")
