import os

files_to_fix = [
    'src/app/admit-cards/page.tsx',
    'src/app/results/page.tsx',
    'src/app/study-materials/page.tsx',
    'src/app/syllabus/page.tsx'
]

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    has_use_client = False
    new_lines = []
    
    for line in lines:
        if '"use client"' in line or "'use client'" in line:
            has_use_client = True
        else:
            new_lines.append(line)
            
    if has_use_client:
        new_lines.insert(0, '"use client";\n')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
