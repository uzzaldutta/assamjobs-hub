import re

with open('src/app/search/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('theme="violet"', 'theme="purple"')
with open('src/app/search/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

with open('src/app/tools/eligibility-checker/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('theme="emerald"', 'theme="green"')
with open('src/app/tools/eligibility-checker/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
