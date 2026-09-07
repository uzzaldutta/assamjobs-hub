file_path = "src/app/api/cron/ingestion/route.ts"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()

import_statement = "import { NHMAssamAdapter } from '@/lib/ingestion/adapters/NHMAssamAdapter';\n"
if "NHMAssamAdapter" not in content:
    content = content.replace("import { GenericAssamGovAdapter }", import_statement + "import { GenericAssamGovAdapter }")

adapter_logic = "else if (source.adapter_name === 'NHMAssamAdapter') adapterInstance = new NHMAssamAdapter(source);"
if "NHMAssamAdapter(source)" not in content:
    content = content.replace("else if (source.adapter_name === 'GenericAssamGovAdapter') adapterInstance = new GenericAssamGovAdapter(source);", 
                              "else if (source.adapter_name === 'GenericAssamGovAdapter') adapterInstance = new GenericAssamGovAdapter(source);\n        " + adapter_logic)

with open(file_path, "w", encoding="utf-8") as f: f.write(content)
print("Updated route.ts with NHMAssamAdapter")
