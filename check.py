with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<select ' in line.lower():
        print(f"Line {i}: {line.strip()}")
