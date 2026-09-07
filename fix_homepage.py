import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "supabase.from('admissions').select('id, title, institution_name, last_date, created_at').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(10),",
    "supabase.from('jobs').select('id, title, organization, last_date, created_at').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION').order('created_at', { ascending: false }).limit(10),"
)

content = content.replace(
    "supabase.from('admissions').select('id, title, institution_name, last_date, created_at').eq('status', 'PUBLISHED').gte('last_date', today).order('last_date', { ascending: true }).limit(10),",
    "supabase.from('jobs').select('id, title, organization, last_date, created_at').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION').gte('last_date', today).order('last_date', { ascending: true }).limit(10),"
)

content = content.replace(
    "const { data: recentAdmissions } = await supabase.from('admissions').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);",
    "const { data: recentAdmissions } = await supabase.from('jobs').select('*').eq('status', 'PUBLISHED').eq('job_type', 'ADMISSION').order('created_at', { ascending: false }).limit(2);"
)

# And in FeedList or similar components inside page.tsx, we must check what properties they read. They probably expect 'title', 'organization' etc.
with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("page.tsx updated")
