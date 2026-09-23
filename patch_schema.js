const fs = require('fs');
let p = 'src/app/jobs/[slug]/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const tinySchemaRegex = /<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/;

const breadcrumbSchema = `
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://assamjobshub.com" },
      { "@type": "ListItem", "position": 2, "name": "Jobs", "item": "https://assamjobshub.com/jobs" },
      { "@type": "ListItem", "position": 3, "name": job.title, "item": \`https://assamjobshub.com/jobs/\${job.slug || job.id}\` }
    ]
  };
`;

const jobSchema = `
  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.unique_description || \`Details for \${job.title} by \${job.organization}\`,
    "datePosted": job.scraped_at || new Date().toISOString(),
    ...(job.last_date ? { "validThrough": new Date(job.last_date).toISOString() } : {}),
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization || "AssamJobs Hub",
      "sameAs": "https://assamjobshub.com"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Assam",
        "addressCountry": "IN"
      }
    },
    "employmentType": job.job_type === "GOVERNMENT" ? "FULL_TIME" : (job.job_type === "PRIVATE" ? "FULL_TIME" : "OTHER")
  };
`;

const scripts = `
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
`;

// Remove the old tiny schema
c = c.replace(tinySchemaRegex, scripts);

// Insert the JS objects before the return statement of JobDetails
const insertIndex = c.lastIndexOf('return (');
c = c.slice(0, insertIndex) + breadcrumbSchema + jobSchema + '\n  ' + c.slice(insertIndex);

// Add visible breadcrumbs
const visibleBreadcrumbs = `
            {/* Breadcrumbs */}
            <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <Link href="/jobs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Jobs</Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-800 dark:text-gray-200 truncate max-w-[150px] sm:max-w-[300px]">{job.title}</span>
                  </div>
                </li>
              </ol>
            </nav>
`;

// Replace the old "Back to Jobs" link with breadcrumbs
c = c.replace(
  /<Link href="\/jobs"[^>]*>[\s\S]*?<\/Link>/,
  visibleBreadcrumbs
);


fs.writeFileSync(p, c);
console.log("Injected rich JobPosting and Breadcrumbs");
