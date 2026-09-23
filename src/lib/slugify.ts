import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function generateUniqueSlug(title: string): Promise<string> {
  let base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  if (!base) base = 'job-' + Date.now(); // emergency fallback
  
  let finalSlug = base;
  let counter = 2;
  while (true) {
    const { data } = await supabase.from('jobs').select('id').eq('slug', finalSlug).maybeSingle();
    if (!data) break;
    finalSlug = `${base}-${counter}`;
    counter++;
  }
  return finalSlug;
}
