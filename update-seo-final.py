with open(r"src/app/jobs/[id]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

json_ld_script = """
  const jobPostingSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || job.title,
    "datePosted": job.scraped_at || job.created_at || new Date().toISOString(),
    "validThrough": job.last_date ? new Date(job.last_date).toISOString() : undefined,
    "employmentType": job.job_type === "GOVERNMENT" ? "FULL_TIME" : "OTHER",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization || "AssamJobs Hub Verified Employer",
      "sameAs": "https://assamjobshub.in"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "Assam",
        "addressRegion": "AS",
        "addressCountry": "IN"
      }
    }
  };

"""

# Insert json schema right before the main return statement.
main_return = '  return (\n    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">'
main_return_new = main_return.replace('return (\n    <div', 'return (\n    <>\n      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }} />\n      <div')

# we also need to close the fragment at the VERY bottom.
# The file ends with:
#     </div>
#   );
# }

content = content.replace(main_return, json_ld_script + main_return_new)
content = content.replace('    </div>\n  );\n}', '    </div>\n    </>\n  );\n}')

with open(r"src/app/jobs/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
