const fs = require('fs');
let p = 'src/app/jobs/[slug]/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const metadataRegex = /export async function generateMetadata[\s\S]*?return \{/;
const newMetadata = `
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  let { data: job } = await supabase.from('jobs').select('*').eq('slug', slug).maybeSingle();
  
  if (!job) {
    const { data: jobById } = await supabase.from('jobs').select('*').eq('id', slug).maybeSingle();
    if (jobById) job = jobById;
  }
  
  if (!job || job.status !== 'PUBLISHED') {
    return { title: 'Not Found', robots: { index: false } };
  }

  const org = job.organization || 'AssamJobs Hub';
  const title = \`\${job.title} - Vacancy, Eligibility & Apply\`;
  const vacanciesText = job.vacancies && job.vacancies !== 'Not Specified' ? \` | Vacancies: \${job.vacancies}\` : '';
  const dateText = job.last_date ? \` | Last Date: \${new Date(job.last_date).toLocaleDateString('en-IN')}\` : '';
  const desc = \`AssamJobsHub: Details for \${job.title} by \${org}\${vacanciesText}\${dateText}. Check eligibility, age limit, and application process.\`;
  
  const baseUrl = 'https://assamjobshub.com';
  const url = \`\${baseUrl}/jobs/\${job.slug || job.id}\`;

  return {
`;

c = c.replace(metadataRegex, newMetadata);

const detailsRegex = /export default async function JobDetails[\s\S]*?\/\/ Determine Deadline State/;
const newDetails = `
export default async function JobDetails(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  
  let { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
    
  if (!job) {
    const { data: jobById } = await supabase.from('jobs').select('*').eq('id', slug).maybeSingle();
    if (jobById && jobById.slug) {
      redirect(\`/jobs/\${jobById.slug}\`);
    }
  }
    
  if (error && !job || !job || job.status !== 'PUBLISHED') {
    notFound();
  }

  // 301 Redirect for old URLs
  if (job.slug && job.slug !== slug) {
    redirect(\`/jobs/\${job.slug}\`);
  }

  // Determine Deadline State
`;

c = c.replace(detailsRegex, newDetails.trim());

fs.writeFileSync(p, c);
console.log("Updated slug lookup performance");
