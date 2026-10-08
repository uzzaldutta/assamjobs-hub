const fs = require('fs');
let page = fs.readFileSync('src/app/jobs/[slug]/page.tsx', 'utf8');

const regex = /<script[\s\S]*?"@type": "JobPosting"[\s\S]*?\/>/m;

const newScript = '<script\n' +
'          type="application/ld+json"\n' +
'          dangerouslySetInnerHTML={{\n' +
'            __html: JSON.stringify({\n' +
'              "@context": "https://schema.org",\n' +
'              "@type": "JobPosting",\n' +
'              "title": job.title,\n' +
'              "description": job.unique_description ? job.unique_description.replace(/<[^>]*>?/gm, "").substring(0, 1000) : "Details for " + job.title,\n' +
'              "datePosted": job.scraped_at || job.created_at || new Date().toISOString(),\n' +
'              "validThrough": job.last_date ? new Date(job.last_date).toISOString() : new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),\n' +
'              "employmentType": job.job_type === "GOVERNMENT" ? "FULL_TIME" : "OTHER",\n' +
'              "hiringOrganization": {\n' +
'                "@type": "Organization",\n' +
'                "name": job.organization || "Assam Govt / Private Sector",\n' +
'                "sameAs": "https://assamjobshub.com"\n' +
'              },\n' +
'              "jobLocation": {\n' +
'                "@type": "Place",\n' +
'                "address": {\n' +
'                  "@type": "PostalAddress",\n' +
'                  "addressLocality": job.district || "Assam",\n' +
'                  "addressRegion": "AS",\n' +
'                  "addressCountry": "IN"\n' +
'                }\n' +
'              }\n' +
'            })\n' +
'          }}\n' +
'        />';

page = page.replace(regex, newScript);
fs.writeFileSync('src/app/jobs/[slug]/page.tsx', page);