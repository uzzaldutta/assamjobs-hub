import fs

def replace_in_file(filepath, replacements):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    for old, new in replacements.items():
        content = content.replace(old, new)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

# Fix page.tsx
replace_in_file("src/app/page.tsx", {
    ".order('created_at'": ".order('scraped_at'",
    "'application_end'": "'last_date'",
    "const { data: recentResults }": "const { data: recentResults, error: err1 } = await supabase.from('results').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);\n  const { data: recentAdmitCards } = await supabase.from('admit_cards').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);\n  const { data: recentAdmissions } = await supabase.from('admissions').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);\n  const { data: latestTenders } = await supabase.from('tenders').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);\n  const { data: scholarships } = await supabase.from('scholarships').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false }).limit(2);\n  // NOTE: In JS we shouldn't define identical variables twice if we use let, but const is block scoped. Let's do it safely."
})

# Let's write a safer replace for page.tsx
with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace(".order('created_at'", ".order('scraped_at'")
content = content.replace("'application_end'", "'last_date'")
# Wait, replacing all order('created_at') to scraped_at will also affect Results, Admit Cards, etc!
# I need to specifically replace the jobs ones.
# In page.tsx, jobs are the first 3 queries.
