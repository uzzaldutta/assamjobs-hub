import re

with open('src/app/admin/studio/ingestion/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# For jobs:
content = re.sub(
    r"(verification_status: sourceMeta\?\.is_official \? 'VERIFIED' : 'VERIFICATION_PENDING',\s*official_source_url: payload\.sourceUrl \|\| null\s*\})\.select\('id'\)\.single\(\);\s*if \(insertErr\) throw new Error\(insertErr\.message\);\s*newRecordId = newJob\.id;",
    r"verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING',\n          official_source_url: payload.sourceUrl || null,\n          unique_description: payload.description || null\n        }).select('id').single();\n        if (insertErr) throw new Error(insertErr.message);\n        newRecordId = newJob.id;",
    content
)

# For admissions (which also go to jobs table):
content = re.sub(
    r"(verification_status: sourceMeta\?\.is_official \? 'VERIFIED' : 'VERIFICATION_PENDING'\s*\})\.select\('id'\)\.single\(\);\s*if \(insertErr\) throw new Error\(insertErr\.message\);\s*newRecordId = newAdm\.id;",
    r"verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING',\n          unique_description: payload.description || null\n        }).select('id').single();\n        if (insertErr) throw new Error(insertErr.message);\n        newRecordId = newAdm.id;",
    content
)

with open('src/app/admin/studio/ingestion/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)