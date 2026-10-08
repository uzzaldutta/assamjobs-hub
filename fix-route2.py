import re

with open('src/app/api/admin/fetch-url/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('if (authHeader !== \\Bearer \\\\) {', 'if (authHeader !== Bearer ) {')

with open('src/app/api/admin/fetch-url/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)