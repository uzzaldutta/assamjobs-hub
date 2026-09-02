import re

with open("src/app/admissions/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('theme="violet"', 'theme="purple"')

with open("src/app/admissions/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
