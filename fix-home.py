import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import FeedList from "@/components/FeedList";',
    'import FeedList from "@/components/FeedList";\nimport RecentlyViewed from "@/components/RecentlyViewed";'
)

render_pattern = re.compile(r'(<FeedList initialJobs=\{allJobs\})', re.DOTALL)
insert_render = r'''<RecentlyViewed />\n        \n        \1'''
content = render_pattern.sub(insert_render, content)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
