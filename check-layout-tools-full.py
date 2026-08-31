with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'Global Bottom Tools Section' in line:
        print("".join(lines[max(0, i-2):i+80]))
        break
