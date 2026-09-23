const fs = require('fs');
let p = 'src/app/admin/studio/ingestion/actions.ts';
let c = fs.readFileSync(p, 'utf8');

if (c.includes('async function generateUniqueSlug(title: string)')) {
  // Add import
  c = c.replace(
    'import { revalidatePath } from "next/cache";',
    'import { revalidatePath } from "next/cache";\nimport { generateUniqueSlug } from "@/lib/slugify";'
  );
  
  // Remove the old inline function block
  // It starts with 'async function generateUniqueSlug(title: string): Promise<string> {' and ends with 'return finalSlug;\n}'
  c = c.replace(/async function generateUniqueSlug\([\s\S]*?return finalSlug;\n\}\n/g, "");
  
  fs.writeFileSync(p, c);
  console.log("Patched actions.ts");
}
