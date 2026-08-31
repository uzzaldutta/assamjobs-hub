with open('src/components/TendersDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r'(const matchesSearch = \(tender\.title \|\| ""\)\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\) \|\| \s*\(tender\.organization \|\| ""\)\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\);)'
replacement = r'const shortId = "AJH-" + (tender.id || "").slice(-6).toUpperCase();\n    const matchesSearch = (tender.title || "").toLowerCase().includes(search.toLowerCase()) || \n                          (tender.organization || "").toLowerCase().includes(search.toLowerCase()) ||\n                          shortId.toLowerCase().includes(search.toLowerCase());'
content = re.sub(pattern, replacement, content)

with open('src/components/TendersDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added ID search to TendersDashboard")
