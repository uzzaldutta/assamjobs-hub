with open('src/app/study-materials/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("select('id, title, created_at, job_type')", "select('id, title, scraped_at, job_type')")
content = content.replace("order('created_at',", "order('scraped_at',")

with open('src/app/study-materials/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/app/study-materials/[materialId]/page.tsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = content2.replace("select('title, unique_description, official_pdf_url, created_at')", "select('title, unique_description, official_pdf_url, scraped_at')")
content2 = content2.replace("data.created_at", "data.scraped_at")

with open('src/app/study-materials/[materialId]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content2)

print("Fixed Supabase queries")
