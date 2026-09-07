import re

with open("src/app/api/cron/ingestion/route.ts", "r", encoding="utf-8") as f:
    content = f.read()

if 'GenericAggregatorAdapter' not in content:
    content = content.replace(
        "import { AssamCareerAdapter } from '@/lib/ingestion/adapters/AssamCareerAdapter';",
        "import { AssamCareerAdapter } from '@/lib/ingestion/adapters/AssamCareerAdapter';\nimport { GenericAggregatorAdapter } from '@/lib/ingestion/adapters/GenericAggregatorAdapter';"
    )
    content = content.replace(
        "else if (source.adapter_name === 'NHMAssamAdapter') adapterInstance = new NHMAssamAdapter(source);",
        "else if (source.adapter_name === 'NHMAssamAdapter') adapterInstance = new NHMAssamAdapter(source);\n        else if (source.adapter_name === 'GenericAggregatorAdapter') adapterInstance = new GenericAggregatorAdapter(source);"
    )
    with open("src/app/api/cron/ingestion/route.ts", "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated cron route")
else:
    print("Already in cron route")
