const fs = require('fs');

let pagePath = 'src/app/admin/studio/ingestion/actions.ts';
let content = fs.readFileSync(pagePath, 'utf8');

const oldStr = `  // --- SURGICAL CACHE INVALIDATION ---
  revalidatePath('/');
  revalidatePath('/jobs');
  revalidatePath('/jobs/[id]', 'page');
  revalidatePath('/tenders');
  revalidatePath('/tenders/[id]', 'page');
  revalidatePath('/admissions');
  revalidatePath('/admissions/[id]', 'page');
  revalidatePath('/results');
  revalidatePath('/results/[id]', 'page');
  revalidatePath('/admit-cards');
  revalidatePath('/admit-cards/[id]', 'page');
  revalidatePath('/scholarships');
  revalidatePath('/scholarships/[id]', 'page');
  // -----------------------------------`;

const newStr = `  // --- SURGICAL CACHE INVALIDATION ---
  revalidatePath('/');
  
  if (item.content_type === 'JOB' || item.content_type === 'RAILWAY') {
    revalidatePath('/jobs');
    if (newRecordId) revalidatePath(\`/jobs/\${newRecordId}\`);
  } else if (item.content_type === 'TENDER') {
    revalidatePath('/tenders');
    if (newRecordId) revalidatePath(\`/tenders/\${newRecordId}\`);
  } else if (item.content_type === 'ADMISSION') {
    revalidatePath('/admissions');
    if (newRecordId) revalidatePath(\`/admissions/\${newRecordId}\`);
  } else if (item.content_type === 'RESULT') {
    revalidatePath('/results');
    if (newRecordId) revalidatePath(\`/results/\${newRecordId}\`);
  } else if (item.content_type === 'ADMIT_CARD') {
    revalidatePath('/admit-cards');
    if (newRecordId) revalidatePath(\`/admit-cards/\${newRecordId}\`);
  } else if (item.content_type === 'SCHOLARSHIP') {
    revalidatePath('/scholarships');
    if (newRecordId) revalidatePath(\`/scholarships/\${newRecordId}\`);
  }
  // -----------------------------------`;

if (content.includes("revalidatePath('/jobs/[id]', 'page');")) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(pagePath, content);
    console.log("Patched actions.ts");
} else {
    console.log("actions.ts target not found");
}
