const fs = require('fs');
let p = 'src/app/admin/studio/ingestion/actions.ts';
let c = fs.readFileSync(p, 'utf8');

if (!c.includes('generateUniqueSlug')) {
  let slugFunc = `
async function generateUniqueSlug(title: string): Promise<string> {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  let finalSlug = base;
  let counter = 2;
  while (true) {
    const { data } = await supabase.from('jobs').select('id').eq('slug', finalSlug).maybeSingle();
    if (!data) break;
    finalSlug = \`\${base}-\${counter}\`;
    counter++;
  }
  return finalSlug;
}
`;
  
  c = c.replace('export async function approveQueueItemAction', slugFunc + '\nexport async function approveQueueItemAction');
  
  // Replace the JOB/PRIVATE_JOB insert
  c = c.replace(
    "id: item.id,",
    "id: item.id,\n        slug: await generateUniqueSlug(payload.title),"
  );
  
  // Replace the ADMISSION insert (which goes to jobs)
  c = c.replace(
    "job_type: 'ADMISSION',",
    "job_type: 'ADMISSION',\n        slug: await generateUniqueSlug(payload.title),"
  );
  
  fs.writeFileSync(p, c);
  console.log("Updated actions.ts with slug generation");
}
