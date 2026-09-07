import os

lists = [
    ("src/app/jobs/page.tsx", "Jobs in Assam", "Latest Government & Private jobs in Assam. Apply online for Assam Police, ADRE, APSC and other recruitment."),
    ("src/app/tenders/page.tsx", "Tenders in Assam", "Latest e-Procurement and Government Tenders in Assam."),
    ("src/app/admissions/page.tsx", "Admissions in Assam", "Latest university and college admission notifications in Assam."),
    ("src/app/results/page.tsx", "Results in Assam", "Latest exam results and merit lists for Assam recruitment and education."),
    ("src/app/admit-cards/page.tsx", "Admit Cards", "Download admit cards for Assam Police, APSC, ADRE and other exams."),
    ("src/app/scholarships/page.tsx", "Scholarships", "Latest scholarship schemes and educational funding in Assam."),
    ("src/app/exams/page.tsx", "Exams Preparation", "Prepare for APSC, ADRE, Assam Police with syllabus, mock tests, and study materials."),
]

for file_path, title, desc in lists:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "export const metadata" not in content:
        route = file_path.replace("src/app", "").replace("/page.tsx", "")
        meta = f"""
export const metadata = {{
  title: "{title}",
  description: "{desc}",
  alternates: {{
    canonical: "{route}",
  }}
}};
"""
        content = content.replace("export const revalidate = 60;\n", f"export const revalidate = 60;\n{meta}")
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

print("Added metadata to list pages.")
