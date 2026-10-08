import re

with open('src/app/jobs/[slug]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if "import rehypeRaw from 'rehype-raw';" not in content:
    content = content.replace("import remarkGfm from 'remark-gfm';", "import remarkGfm from 'remark-gfm';\nimport rehypeRaw from 'rehype-raw';")

# Update ReactMarkdown components
content = content.replace(
    "<ReactMarkdown remarkPlugins={[remarkGfm]}>{job.unique_description}</ReactMarkdown>",
    "<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{job.unique_description}</ReactMarkdown>"
)
content = content.replace(
    "<ReactMarkdown remarkPlugins={[remarkGfm]}>{job.unique_description_assamese}</ReactMarkdown>",
    "<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{job.unique_description_assamese}</ReactMarkdown>"
)

with open('src/app/jobs/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)