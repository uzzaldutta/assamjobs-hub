import re

with open("src/app/admissions/[id]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(".from('admissions')", ".from('jobs')")
content = content.replace("record.institution", "record.organization")
content = content.replace("record.course", "record.title")
content = content.replace("record.application_deadline", "record.closing_date")
content = content.replace("record.application_link", "record.application_url")
content = content.replace("record.official_pdf_url", "record.notification_url")

with open("src/app/admissions/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("admissions detail updated")
