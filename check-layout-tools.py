with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'Featured Applicant Tools' in line:
        print("".join(lines[max(0, i-5):i+20]))
        break
