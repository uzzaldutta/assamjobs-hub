const fs = require('fs');
let content = fs.readFileSync('src/app/admin/studio/ingestion/actions.ts', 'utf8');

// For jobs
content = content.replace(
    /official_source_url:\s*payload\.sourceUrl\s*\|\|\s*null\s*\}\)\.select\('id'\)\.single\(\);\s*if\s*\(insertErr\)\s*throw\s*new\s*Error\(insertErr\.message\);\s*newRecordId\s*=\s*newJob\.id;/,
    "official_source_url: payload.sourceUrl || null,\n          unique_description: payload.description || null\n        }).select('id').single();\n        if (insertErr) throw new Error(insertErr.message);\n        newRecordId = newJob.id;"
);

// For admissions
content = content.replace(
    /official_source_url:\s*payload\.sourceUrl\s*\|\|\s*null,\s*status:\s*'PUBLISHED',\s*verification_status:\s*sourceMeta\?\.is_official\s*\?\s*'VERIFIED'\s*:\s*'VERIFICATION_PENDING'\s*\}\)\.select\('id'\)\.single\(\);\s*if\s*\(insertErr\)\s*throw\s*new\s*Error\(insertErr\.message\);\s*newRecordId\s*=\s*newAdm\.id;/,
    "official_source_url: payload.sourceUrl || null,\n          status: 'PUBLISHED',\n          verification_status: sourceMeta?.is_official ? 'VERIFIED' : 'VERIFICATION_PENDING',\n          unique_description: payload.description || null\n        }).select('id').single();\n        if (insertErr) throw new Error(insertErr.message);\n        newRecordId = newAdm.id;"
);

fs.writeFileSync('src/app/admin/studio/ingestion/actions.ts', content);