file_path = "src/app/api/cron/ingestion/route.ts"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()

import_statement = "import { GenericAssamGovAdapter } from '@/lib/ingestion/adapters/GenericAssamGovAdapter';\n"
if "GenericAssamGovAdapter" not in content:
    content = content.replace("import { AssamCareerAdapter }", import_statement + "import { AssamCareerAdapter }")

adapter_logic = "else if (source.adapter_name === 'GenericAssamGovAdapter') adapterInstance = new GenericAssamGovAdapter(source);"
if "GenericAssamGovAdapter(source)" not in content:
    content = content.replace("else if (source.adapter_name === 'AssamCareerAdapter') adapterInstance = new AssamCareerAdapter(source);", 
                              "else if (source.adapter_name === 'AssamCareerAdapter') adapterInstance = new AssamCareerAdapter(source);\n        " + adapter_logic)

with open(file_path, "w", encoding="utf-8") as f: f.write(content)
print("Updated route.ts with GenericAssamGovAdapter")
