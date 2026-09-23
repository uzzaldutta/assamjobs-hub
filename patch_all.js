const fs = require('fs');

// 1. edit-job
let p1 = 'src/app/api/admin/edit-job/route.ts';
let c1 = fs.readFileSync(p1, 'utf8');
c1 = c1.replace(/revalidatePath\('\/jobs\/\[id\]', 'page'\);/g, 'revalidatePath(`/jobs/${id}`);');
fs.writeFileSync(p1, c1);
console.log("Patched 1");

// 2. delete-job
let p2 = 'src/app/api/admin/delete-job/route.ts';
let c2 = fs.readFileSync(p2, 'utf8');
c2 = c2.replace(/revalidatePath\('\/jobs\/\[id\]', 'page'\);/g, 'revalidatePath(`/jobs/${id}`);');
fs.writeFileSync(p2, c2);
console.log("Patched 2");

// 3. add-job
let p3 = 'src/app/api/admin/add-job/route.ts';
let c3 = fs.readFileSync(p3, 'utf8');
c3 = c3.replace(/revalidatePath\('\/jobs\/\[id\]', 'page'\);/g, 'revalidatePath(`/jobs/${newEntry.id}`);');
fs.writeFileSync(p3, c3);
console.log("Patched 3");

// 4. spam-control
let p4 = 'src/app/api/admin/spam-control/route.ts';
let c4 = fs.readFileSync(p4, 'utf8');
c4 = c4.replace(/if \(deleteError\) throw deleteError;\s+deletedCount = idsToDelete.length;\s+}/g, 'if (deleteError) throw deleteError;\n      deletedCount = idsToDelete.length;\n      idsToDelete.forEach(id => revalidatePath(`/jobs/${id}`));\n    }');
c4 = c4.replace(/revalidatePath\('\/jobs\/\[id\]', 'page'\);/g, '// Broad invalidation removed');
fs.writeFileSync(p4, c4);
console.log("Patched 4");

// 5. actions.ts (ingestion)
let p5 = 'src/app/admin/studio/ingestion/actions.ts';
let c5 = fs.readFileSync(p5, 'utf8');
c5 = c5.replace(/revalidatePath\('\/jobs\/\[id\]', 'page'\);/g, 'if (newRecordId) revalidatePath(`/jobs/${newRecordId}`);');
c5 = c5.replace(/revalidatePath\('\/tenders\/\[id\]', 'page'\);/g, 'if (newRecordId) revalidatePath(`/tenders/${newRecordId}`);');
c5 = c5.replace(/revalidatePath\('\/admissions\/\[id\]', 'page'\);/g, 'if (newRecordId) revalidatePath(`/admissions/${newRecordId}`);');
c5 = c5.replace(/revalidatePath\('\/results\/\[id\]', 'page'\);/g, 'if (newRecordId) revalidatePath(`/results/${newRecordId}`);');
c5 = c5.replace(/revalidatePath\('\/admit-cards\/\[id\]', 'page'\);/g, 'if (newRecordId) revalidatePath(`/admit-cards/${newRecordId}`);');
c5 = c5.replace(/revalidatePath\('\/scholarships\/\[id\]', 'page'\);/g, 'if (newRecordId) revalidatePath(`/scholarships/${newRecordId}`);');
fs.writeFileSync(p5, c5);
console.log("Patched 5");

