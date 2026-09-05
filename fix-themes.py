import os

fixes = {
    "src/app/mock-tests/page.tsx": ('theme="indigo"', 'theme="purple"'),
    "src/app/study-materials/page.tsx": ('theme="teal"', 'theme="green"'),
    "src/app/syllabus/page.tsx": ('theme="violet"', 'theme="purple"')
}

for path, (old, new) in fixes.items():
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace(old, new)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Fixed PageHeader themes.")
