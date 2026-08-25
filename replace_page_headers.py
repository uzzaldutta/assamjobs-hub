import os
import re

files_to_update = {
    'src/app/admit-cards/page.tsx': {
        'title': 'Download Admit Cards',
        'subtitle': 'Get the latest hall tickets for upcoming exams',
        'theme': 'purple',
        'import': 'import PageHeader from "@/components/PageHeader";\n'
    },
    'src/app/results/page.tsx': {
        'title': 'Exam Results',
        'subtitle': 'Check the latest results for Assam govt and private exams',
        'theme': 'green',
        'import': 'import PageHeader from "@/components/PageHeader";\n'
    },
    'src/app/study-materials/page.tsx': {
        'title': 'Study Materials',
        'subtitle': 'Download free PDFs, previous papers, and mock tests',
        'theme': 'orange',
        'import': 'import PageHeader from "@/components/PageHeader";\n'
    },
    'src/app/syllabus/page.tsx': {
        'title': 'Exam Syllabus',
        'subtitle': 'Download official syllabuses for all major Assam exams',
        'theme': 'blue',
        'import': 'import PageHeader from "@/components/PageHeader";\n'
    }
}

for filepath, meta in files_to_update.items():
    if not os.path.exists(filepath):
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add import if missing
    if 'import PageHeader' not in content:
        content = meta['import'] + content

    # Find the container that holds the header. 
    # Usually it looks like: <div className="bg-XXXX... px-4 pt-6...
    # We will replace the entire first child of <div className="flex flex-col min-h-screen">
    
    # We can use regex to replace the first <div className="bg-[a-z]+-600... </div> block
    pattern = re.compile(r'<div className="bg-[a-z]+-600.*?</p>\s*</div>', re.DOTALL)
    
    new_header = f"""<PageHeader 
        title="{meta['title']}" 
        subtitle="{meta['subtitle']}" 
        theme="{meta['theme']}" 
      />"""

    content = pattern.sub(new_header, content, count=1)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
