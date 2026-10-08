const fs = require('fs');
let page = fs.readFileSync('src/app/jobs/[slug]/page.tsx', 'utf8');

const regex = /<script\s+type="application\/ld\+json"\s+dangerouslySetInnerHTML=\{\{\s+__html: JSON\.stringify\(\{[\s\S]*?"@type": "JobPosting"[\s\S]*?\}\)\s+\}\}\s+\/>/m;

const newScript = <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              "title": job.title,
              "description": job.unique_description ? job.unique_description.replace(/<[^>]*>?/gm, "").substring(0, 1000) : "Details for " + job.title,
              "datePosted": job.scraped_at || job.created_at || new Date().toISOString(),
              "validThrough": job.last_date ? new Date(job.last_date).toISOString() : new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
              "employmentType": job.job_type === "GOVERNMENT" ? "FULL_TIME" : "OTHER",
              "hiringOrganization": {
                "@type": "Organization",
                "name": job.organization || "Assam Govt / Private Sector",
                "sameAs": "https://assamjobshub.com"
              },
              "jobLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": job.district || "Assam",
                  "addressRegion": "AS",
                  "addressCountry": "IN"
                }
              },
              "baseSalary": {
                "@type": "MonetaryAmount",
                "currency": "INR",
                "value": {
                  "@type": "QuantitativeValue",
                  "value": 10000,
                  "unitText": "MONTH"
                }
              }
            })
          }}
        />;

page = page.replace(regex, newScript);
fs.writeFileSync('src/app/jobs/[slug]/page.tsx', page);