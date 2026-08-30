with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'Admit Card' in line:
        print("".join(lines[max(0, i-5):i+20]))
        break
