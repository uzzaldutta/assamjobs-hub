with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'FULL-WIDTH QUICK CATEGORY TABS' in line:
        print("".join(lines[max(0, i+30):i+80]).encode('ascii', 'ignore').decode('ascii'))
        break
