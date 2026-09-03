code = """
import fs

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# For Jobs only (first half of the file)
content = content.replace(
    ".eq('job_type', 'GOVERNMENT')\n    .order('created_at', { ascending: false })",
    ".eq('job_type', 'GOVERNMENT')\n    .order('scraped_at', { ascending: false })"
)
content = content.replace(
    ".eq('job_type', 'PRIVATE')\n    .order('created_at', { ascending: false })",
    ".eq('job_type', 'PRIVATE')\n    .order('scraped_at', { ascending: false })"
)

content = content.replace("gte('application_end'", "gte('last_date'")
content = content.replace("lte('application_end'", "lte('last_date'")
content = content.replace("order('application_end'", "order('last_date'")

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)


with open("src/app/jobs/page.tsx", "r", encoding="utf-8") as f:
    jcontent = f.read()

jcontent = jcontent.replace("gte('application_end'", "gte('last_date'")
jcontent = jcontent.replace("lte('application_end'", "lte('last_date'")
jcontent = jcontent.replace("lt('application_end'", "lt('last_date'")
jcontent = jcontent.replace("order('application_end'", "order('last_date'")
jcontent = jcontent.replace("order('created_at'", "order('scraped_at'")

with open("src/app/jobs/page.tsx", "w", encoding="utf-8") as f:
    f.write(jcontent)


with open("src/components/JobCard.tsx", "r", encoding="utf-8") as f:
    ccontent = f.read()

ccontent = ccontent.replace("job.application_end", "job.last_date")

with open("src/components/JobCard.tsx", "w", encoding="utf-8") as f:
    f.write(ccontent)
"""
with open("apply-fix.py", "w", encoding="utf-8") as f:
    f.write(code)
