const fs = require('fs');

// 1. Fix layout.tsx
let layoutPath = 'src/app/layout.tsx';
let layout = fs.readFileSync(layoutPath, 'utf8');
layout = layout.replace(
  "export const metadata: Metadata = {",
  "export const metadata: Metadata = {\n  metadataBase: new URL('https://assamjobshub.com'),"
);
layout = layout.replace(
  "url: 'https://assamjobs-hub.vercel.app',",
  "url: 'https://assamjobshub.com',"
);
fs.writeFileSync(layoutPath, layout);


// 2. Fix homepage page.tsx
let homePath = 'src/app/page.tsx';
let home = fs.readFileSync(homePath, 'utf8');
if (!home.includes('export const metadata')) {
  let homeMeta = `\nexport const metadata = {\n  title: "Assam Govt Jobs 2026 | Latest Assam Government & Private Jobs",\n  description: "Find the latest Assam government jobs, private jobs, recruitment notifications, admit cards, results, exam preparation, and free mock tests at AssamJobsHub.",\n  alternates: {\n    canonical: "/",\n  }\n};\n`;
  home = home.replace("export default async function Home() {", homeMeta + "\nexport default async function Home() {");
  fs.writeFileSync(homePath, home);
}

// 3. Fix sitemap.ts
let sitemapPath = 'src/app/sitemap.ts';
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
sitemap = sitemap.replace(
  "const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com';",
  "const baseUrl = 'https://assamjobshub.com';"
);
fs.writeFileSync(sitemapPath, sitemap);

// 4. Fix robots.ts
let robotsPath = 'src/app/robots.ts';
let robots = fs.readFileSync(robotsPath, 'utf8');
robots = robots.replace(
  "const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com';",
  "const baseUrl = 'https://assamjobshub.com';"
);
fs.writeFileSync(robotsPath, robots);

// 5. Add JobPosting schema to jobs/[id]/page.tsx
let jobPagePath = 'src/app/jobs/[id]/page.tsx';
let jobPage = fs.readFileSync(jobPagePath, 'utf8');
jobPage = jobPage.replace(
  "const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://assamjobs-hub.com';",
  "const baseUrl = 'https://assamjobshub.com';"
);
jobPage = jobPage.replace(
  "title: `${job.title} at ${org}`,",
  "title: `${job.title} - Vacancy, Eligibility, Apply Online | AssamJobs Hub`,"
);
// add schema block inside JobDetails render
let schemaBlock = `
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.unique_description || job.title,
    "datePosted": job.scraped_at || new Date().toISOString(),
    "validThrough": job.last_date ? new Date(job.last_date).toISOString() : undefined,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization || "AssamJobs Hub"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Assam",
        "addressCountry": "IN"
      }
    }
  };
`;
if(!jobPage.includes('"@type": "JobPosting"')) {
  jobPage = jobPage.replace(
    "let deadlineState = \"ACTIVE\";",
    schemaBlock + "\n  let deadlineState = \"ACTIVE\";"
  );
  jobPage = jobPage.replace(
    "<main className",
    `<script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />\n      <main className`
  );
  fs.writeFileSync(jobPagePath, jobPage);
}

console.log("Safe SEO modifications applied.");
