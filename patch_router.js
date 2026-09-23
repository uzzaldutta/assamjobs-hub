const fs = require('fs');
let p = 'src/app/jobs/[slug]/page.tsx';
let c = fs.readFileSync(p, 'utf8');

// Replace { id: string } with { slug: string }
c = c.replace(/\{ id: string \}/g, "{ slug: string }");

// Replace params.id with params.slug
c = c.replace(/params\.id/g, "params.slug");

// Replace .eq('id', params.slug) with .or(\`id.eq.\${params.slug},slug.eq.\${params.slug}\`)
// Wait, generateMetadata has:
// const { data: job } = await supabase.from('jobs').select('*').eq('id', params.slug).single();
c = c.replace(
  ".eq('id', params.slug)",
  ".or(`id.eq.${params.slug},slug.eq.${params.slug}`)"
);

// In JobDetails:
// const { slug } = params;
// const { data: job, error } = await supabase.from('jobs').select('*').eq('id', slug).single();
c = c.replace(
  "const { id } = params;\n  \n  const { data: job, error } = await supabase\n    .from('jobs')\n    .select('*')\n    .eq('id', id)",
  "const { slug } = params;\n  \n  const { data: job, error } = await supabase\n    .from('jobs')\n    .select('*')\n    .or(`id.eq.${slug},slug.eq.${slug}`)"
);

// If URL has job.slug or job.id
c = c.replace(
  "const url = `${baseUrl}/jobs/${job.id}`;",
  "const url = `${baseUrl}/jobs/${job.slug || job.id}`;"
);

fs.writeFileSync(p, c);
console.log("Updated jobs page router logic");
