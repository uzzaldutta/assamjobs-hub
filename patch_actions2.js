const fs = require('fs');
let p = 'src/app/admin/studio/ingestion/actions.ts';
let c = fs.readFileSync(p, 'utf8');

// Declare modifiedRecordId
c = c.replace(
  '  const payload = item.normalized_payload;',
  '  const payload = item.normalized_payload;\n  let modifiedRecordId: string | null = null;'
);

// Set modifiedRecordId for updates
c = c.replace(
  '    const targetId = item.duplicate_of;',
  '    const targetId = item.duplicate_of;\n    modifiedRecordId = targetId;'
);

// Set modifiedRecordId for inserts (after let newRecordId: string;)
c = c.replace(
  '    let newRecordId: string;',
  '    let newRecordId: string;'
);

c = c.replace(
  /newRecordId = newJob\.id;/g,
  'newRecordId = newJob.id;\n      modifiedRecordId = newRecordId;'
);
c = c.replace(
  /newRecordId = newTender\.id;/g,
  'newRecordId = newTender.id;\n      modifiedRecordId = newRecordId;'
);
c = c.replace(
  /newRecordId = newAdm\.id;/g,
  'newRecordId = newAdm.id;\n      modifiedRecordId = newRecordId;'
);
c = c.replace(
  /newRecordId = newRes\.id;/g,
  'newRecordId = newRes.id;\n      modifiedRecordId = newRecordId;'
);
c = c.replace(
  /newRecordId = newAdc\.id;/g,
  'newRecordId = newAdc.id;\n      modifiedRecordId = newRecordId;'
);
c = c.replace(
  /newRecordId = newSch\.id;/g,
  'newRecordId = newSch.id;\n      modifiedRecordId = newRecordId;'
);

// Fix the bottom invalidation
c = c.replace(/if \(newRecordId\) revalidatePath\(`\/jobs\/\$\{newRecordId\}`\);/g, 'if (modifiedRecordId) revalidatePath(`/jobs/${modifiedRecordId}`);');
c = c.replace(/if \(newRecordId\) revalidatePath\(`\/tenders\/\$\{newRecordId\}`\);/g, 'if (modifiedRecordId) revalidatePath(`/tenders/${modifiedRecordId}`);');
c = c.replace(/if \(newRecordId\) revalidatePath\(`\/admissions\/\$\{newRecordId\}`\);/g, 'if (modifiedRecordId) revalidatePath(`/admissions/${modifiedRecordId}`);');
c = c.replace(/if \(newRecordId\) revalidatePath\(`\/results\/\$\{newRecordId\}`\);/g, 'if (modifiedRecordId) revalidatePath(`/results/${modifiedRecordId}`);');
c = c.replace(/if \(newRecordId\) revalidatePath\(`\/admit-cards\/\$\{newRecordId\}`\);/g, 'if (modifiedRecordId) revalidatePath(`/admit-cards/${modifiedRecordId}`);');
c = c.replace(/if \(newRecordId\) revalidatePath\(`\/scholarships\/\$\{newRecordId\}`\);/g, 'if (modifiedRecordId) revalidatePath(`/scholarships/${modifiedRecordId}`);');

fs.writeFileSync(p, c);
console.log("Patched actions.ts for modifiedRecordId");
