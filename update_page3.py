import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the Recent Items jobs query
content = content.replace(
    "supabase.from('jobs').select('id, title, organization, job_type, last_date, created_at, scraped_at')",
    "supabase.from('jobs').select('id, title, organization, job_type, last_date, scraped_at')"
)

# Fix the Closing Soon Items jobs query
content = content.replace(
    "supabase.from('jobs').select('id, title, organization, job_type, last_date, created_at')",
    "supabase.from('jobs').select('id, title, organization, job_type, last_date, scraped_at')"
)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated jobs query in page.tsx")
