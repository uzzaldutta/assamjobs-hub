with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'QUICK_LINKS =' in line:
        print("".join(lines[i-2:i+15]))
        break
