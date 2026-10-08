import re

with open('src/app/jobs/[slug]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace ReactMarkdown rendering
# We will just strip tabs from the description before passing to ReactMarkdown
replacement = """const cleanDesc = job.unique_description ? job.unique_description.replace(/\\t/g, '') : '';
            const cleanAssamese = job.unique_description_assamese ? job.unique_description_assamese.replace(/\\t/g, '') : '';
"""

if "const cleanDesc" not in content:
    content = content.replace('{/* Description */}', replacement + '\n            {/* Description */}')
    content = content.replace('<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{job.unique_description}</ReactMarkdown>', '<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{cleanDesc}</ReactMarkdown>')
    content = content.replace('<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{job.unique_description_assamese}</ReactMarkdown>', '<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{cleanAssamese}</ReactMarkdown>')

with open('src/app/jobs/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)