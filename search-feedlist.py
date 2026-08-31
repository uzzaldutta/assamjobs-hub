with open('src/components/FeedList.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r'(const matchesSearch =\s*\(job\.title \|\| ""\)\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\) \|\|\s*\(job\.organization \|\| ""\)\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\);)'
replacement = r'const shortId = "AJH-" + (job.id || "").slice(-6).toUpperCase();\n      const matchesSearch = \n        (job.title || "").toLowerCase().includes(search.toLowerCase()) || \n        (job.organization || "").toLowerCase().includes(search.toLowerCase()) ||\n        shortId.toLowerCase().includes(search.toLowerCase());'
content = re.sub(pattern, replacement, content)

with open('src/components/FeedList.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added ID search to FeedList")
