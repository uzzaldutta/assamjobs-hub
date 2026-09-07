import re

with open("src/app/admissions/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    ".from('admissions')",
    ".from('jobs')"
)

content = content.replace(
    ".eq('status', 'PUBLISHED');",
    ".eq('status', 'PUBLISHED')\n    .eq('job_type', 'ADMISSION');"
)

# Admissions fields are different in jobs table (institution -> organization, course -> title, application_deadline -> closing_date, application_link -> application_url)
content = content.replace("item.institution", "item.organization")
content = content.replace("item.course", "item.title")
content = content.replace("item.application_deadline", "item.closing_date")
content = content.replace("item.application_link", "item.application_url")

with open("src/app/admissions/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("admissions page updated")
