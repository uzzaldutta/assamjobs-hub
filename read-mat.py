with open('src/app/study-materials/[materialId]/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'unique_description' in line:
        print("".join(lines[max(0, i-5):i+5]))
        break
