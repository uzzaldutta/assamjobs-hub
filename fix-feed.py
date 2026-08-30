import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the supabase query
old_query = """      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .neq('category', 'BANNED_KEYWORD')
        .order('scraped_at', { ascending: false });"""

new_query = """      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .neq('category', 'BANNED_KEYWORD')
        .neq('category', 'STUDY_MATERIAL')
        .neq('category', 'PREVIOUS_PAPERS')
        .order('scraped_at', { ascending: false });"""

if old_query in content:
    content = content.replace(old_query, new_query)
    with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed page.tsx query")
else:
    print("Failed to find query in page.tsx")
