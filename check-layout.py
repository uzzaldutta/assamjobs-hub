with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'href="/tools"' in line:
        print("".join(lines[max(0, i-10):i+5]).encode('ascii', 'ignore').decode('ascii'))
        break
