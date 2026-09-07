import re

with open("src/components/feeds/AdmissionCard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("admission.application_deadline", "admission.closing_date")
content = content.replace("admission.institution", "admission.organization")
content = content.replace("admission.course", "admission.title")
content = content.replace("admission.apply_url", "admission.application_url")
content = content.replace("admission.official_pdf_url", "admission.notification_url")

with open("src/components/feeds/AdmissionCard.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("AdmissionCard updated for jobs schema")
