import re

with open('src/app/jobs/[slug]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('import remarkGfm from "remark-gfm";', 'import remarkGfm from "remark-gfm";\nimport rehypeRaw from "rehype-raw";')

with open('src/app/jobs/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)