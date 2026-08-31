import re

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove overflow-hidden from the parent containers
content = content.replace('shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden', 'shadow-sm border border-slate-100 dark:border-slate-800')

# 2. Change the marquee container to a native scrolling container
content = content.replace(
    'className="flex w-max animate-marquee gap-4"',
    'className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}'
)

content = content.replace(
    'className="flex w-max animate-marquee-reverse gap-4"',
    'className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}'
)

# 3. Remove the duplicated blocks safely.
# A duplicated block looks like:
# {/* Duplicated Set for Infinite Scroll */}
# <div className="flex gap-4">
#   ...
# </div>

pattern1 = r'\{/\* Duplicated Set for Infinite Scroll \*/\}\s*<div className="flex gap-4">\s*<Link href="/tools/standard-form".*?Fee Calculator</span>\s*</Link>\s*</div>'
content = re.sub(pattern1, '', content, flags=re.DOTALL)

pattern2 = r'\{/\* Duplicated Set for Infinite Scroll \*/\}\s*<div className="flex gap-4">\s*<Link href="/tools/career-advisor".*?AI Cover Letter</span>\s*</Link>\s*</div>'
content = re.sub(pattern2, '', content, flags=re.DOTALL)

# Because we removed the duplicated sets but left the "Original Set" wrapped in a <div className="flex gap-4">, 
# that inner div is now the only child of the scrolling container. 
# It won't scroll properly unless the inner div takes up space, but flex gap-4 handles that perfectly!
# Actually, if there is an inner div wrapper, the scroll snap points won't work on individual links unless they are direct children of the scrolling container.
# Let's unwrap the "Original Set".
unwrap_pattern = r'\{/\* Original Set \*/\}\s*<div className="flex gap-4">\s*(.*?)\s*</div>\s*(?:</div>)'
# Wait, if we unwrap it, we need to replace the whole block carefully.
# Let's just do a manual string replacement for the unwrapper.
