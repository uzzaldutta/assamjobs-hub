import os

path = "src/app/api/check-eligibility/route.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('model: "gemini-3.6-flash"', 'model: "gemini-1.5-flash"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
