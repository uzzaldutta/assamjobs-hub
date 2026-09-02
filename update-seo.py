import re

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

return_replacement = """
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }} />
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
"""

content = re.sub(r'return \(\s*<div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">', json_ld_script + return_replacement, content)
content = re.sub(r'</div>\s*\);\s*\}', '</div>\n    </>\n  );\n}', content)

with open(r"src/app/jobs/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
