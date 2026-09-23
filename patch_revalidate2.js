const fs = require('fs');

function patchRevalidate(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const badRevalidate = "revalidatePath('/', 'layout');";
    const goodRevalidate = `
    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/admissions');
    revalidatePath('/admit-cards');
    revalidatePath('/scholarships');
    revalidatePath('/tenders');
    revalidatePath('/results');
    revalidatePath('/updates');
    // We intentionally DO NOT use revalidatePath('/', 'layout') because it wipes the cache 
    // for all 10,000+ individual detail pages, causing massive Vercel ISR execution costs.
    `;
    
    if (content.includes(badRevalidate)) {
        content = content.replace(badRevalidate, goodRevalidate);
        fs.writeFileSync(filePath, content);
        console.log("Patched " + filePath);
    }
}

patchRevalidate('src/app/api/webhooks/ingest/route.ts');
patchRevalidate('src/app/api/cron/ingestion/route.ts');
