import re

with open('src/app/jobs/[slug]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<div className="p-6 prose prose-slate dark:prose-invert max-w-none prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-xl">',
    '<div className="p-6 prose prose-slate dark:prose-invert max-w-none prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-xl" suppressHydrationWarning>'
)
content = content.replace(
    '<div className="p-6 prose prose-slate dark:prose-invert max-w-none">',
    '<div className="p-6 prose prose-slate dark:prose-invert max-w-none" suppressHydrationWarning>'
)

with open('src/app/jobs/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)