import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\.neq\(\'category\', \'BANNED_KEYWORD\'\)'
replacement = r".neq('category', 'BANNED_KEYWORD')\n        .neq('category', 'STUDY_MATERIAL')\n        .neq('category', 'PREVIOUS_PAPERS')"

content = re.sub(pattern, replacement, content)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex replaced")
