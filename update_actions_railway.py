import re

with open("src/app/admin/studio/ingestion/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()

# I need to change:
# job_type: item.content_type === 'JOB' ? 'GOVERNMENT' : 'PRIVATE',
# category: payload.category || 'OTHER',

pattern = re.compile(r"job_type:\s*item\.content_type === 'JOB' \? 'GOVERNMENT' : 'PRIVATE',")
replacement = "job_type: payload.category === 'RAILWAY' ? 'RAILWAY' : (item.content_type === 'JOB' ? 'GOVERNMENT' : 'PRIVATE'),"

content = pattern.sub(replacement, content)

with open("src/app/admin/studio/ingestion/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated actions.ts")
