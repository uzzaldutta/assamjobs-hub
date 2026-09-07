import fs from 'fs';

// 1. Update supabase.ts to export supabaseAdmin
const supabasePath = "src/lib/supabase.ts";
let supabaseCode = fs.readFileSync(supabasePath, 'utf8');
if (!supabaseCode.includes('supabaseAdmin')) {
    supabaseCode += `\nconst supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';\n`;
    supabaseCode += `export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);\n`;
    fs.writeFileSync(supabasePath, supabaseCode);
    console.log("Updated src/lib/supabase.ts");
}

// 2. Replace import in target files
const targetFiles = [
    "src/lib/ingestion/pipeline.ts",
    "src/app/api/cron/ingestion/route.ts",
    "src/app/admin/studio/ingestion/page.tsx",
    "src/app/admin/studio/ingestion/queue/page.tsx",
    "src/app/admin/studio/ingestion/reports/page.tsx",
    "src/app/admin/studio/ingestion/sources/[id]/page.tsx",
    "src/app/admin/studio/ingestion/queue/[id]/page.tsx",
    "src/app/admin/studio/ingestion/actions.ts"
];

for (const file of targetFiles) {
    try {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(
            'import { supabase } from "@/lib/supabase";',
            'import { supabaseAdmin as supabase } from "@/lib/supabase";'
        );
        content = content.replace(
            "import { supabase } from '@/lib/supabase';",
            "import { supabaseAdmin as supabase } from '@/lib/supabase';"
        );
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } catch (e) {
        console.log(`File not found or error: ${file}`);
    }
}
