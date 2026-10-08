import re

with open('src/app/api/admin/fetch-url/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'authHeader !== \\\\Bearer \\\\\\\\', r'authHeader !== Bearer ', content)

with open('src/app/api/admin/fetch-url/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)