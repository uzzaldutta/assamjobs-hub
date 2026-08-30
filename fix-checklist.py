import re

with open('src/app/jobs/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import RecentlyViewed from "@/components/RecentlyViewed";',
    'import RecentlyViewed from "@/components/RecentlyViewed";\nimport DocumentChecklist from "@/components/DocumentChecklist";'
)

render_pattern = re.compile(r'(<div className="mt-12 mb-12 flex justify-center">)', re.DOTALL)
insert_render = r'''<DocumentChecklist />\n\n        \1'''
content = render_pattern.sub(insert_render, content)

with open('src/app/jobs/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
