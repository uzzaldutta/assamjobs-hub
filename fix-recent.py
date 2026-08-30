import re

with open('src/app/jobs/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import JobCard from "@/components/JobCard";',
    'import JobCard from "@/components/JobCard";\nimport RecentlyViewed from "@/components/RecentlyViewed";'
)

render_pattern = re.compile(r'(<div className="mt-12 mb-12 flex justify-center">)', re.DOTALL)
insert_render = r'''<RecentlyViewed currentJob={job} />\n\n        \1'''
content = render_pattern.sub(insert_render, content)

with open('src/app/jobs/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
