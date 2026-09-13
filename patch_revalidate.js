const fs = require('fs');

function patchFile(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    
    // Add import if missing
    if (!content.includes('revalidatePath')) {
        content = `import { revalidatePath } from 'next/cache';\n` + content;
    }
    
    // Insert before return NextResponse.json
    const target = 'return NextResponse.json({';
    if (content.includes(target) && !content.includes("revalidatePath('/', 'layout')")) {
        content = content.replace(/return NextResponse\.json\(\{\s*success: true,/g, 
            "revalidatePath('/', 'layout');\n    return NextResponse.json({\n      success: true,");
        fs.writeFileSync(path, content);
        console.log(`Patched ${path}`);
    }
}

patchFile('src/app/api/webhooks/ingest/route.ts');
patchFile('src/app/api/cron/ingestion/route.ts');
