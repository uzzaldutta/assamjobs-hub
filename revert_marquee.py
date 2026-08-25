import re

with open('src/components/RecentMarquee.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace vertical scroll logic back to horizontal scroll logic
content = content.replace('el.scrollTop += 1', 'el.scrollLeft += 1')
content = content.replace('el.scrollTop >= el.scrollHeight / 2', 'el.scrollLeft >= el.scrollWidth / 2')
content = content.replace('el.scrollTop -= el.scrollHeight / 2', 'el.scrollLeft -= el.scrollWidth / 2')
content = content.replace('scrollRef.current.scrollTop = 0', 'scrollRef.current.scrollLeft = 0')

# Update container classes back to horizontal
content = content.replace(
    'className="flex flex-col overflow-y-auto hide-scrollbar relative w-full h-[450px] py-2 touch-pan-y snap-y snap-mandatory border-t border-b border-slate-100 dark:border-slate-800"',
    'className="flex overflow-x-auto hide-scrollbar relative w-full py-2 touch-pan-x snap-x snap-mandatory"'
)

# Update the map layout classes back to horizontal
content = content.replace(
    'className="flex flex-col gap-3 min-h-max pb-3 w-full"',
    'className="flex gap-4 min-w-max pr-4"'
)

# Update card classes back to 300px fixed width
content = content.replace(
    'className={`relative overflow-hidden w-full',
    'className={`relative overflow-hidden w-[300px]'
)

with open('src/components/RecentMarquee.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
