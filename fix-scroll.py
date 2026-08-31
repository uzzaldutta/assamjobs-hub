import re

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the overflow-hidden on the parent container (for both sections)
content = content.replace(
    'border-slate-100 dark:border-slate-800 overflow-hidden',
    'border-slate-100 dark:border-slate-800'
)

# 1. Featured Applicant Tools
# Find the start of the marquee container
marquee_start = r'\{/\* Scrolling Marquee Container \*/\}\s*<div className="flex w-max animate-marquee gap-4">\s*\{/\* Original Set \*/\}\s*<div className="flex gap-4">'
new_marquee_start = r'{/* Scrollable Container */}\n                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>'

content = re.sub(marquee_start, new_marquee_start, content)

# Now we need to remove the duplicated set for the first one.
# It ends with the "Fee Calculator" link, then closes a div, then has the Duplicate Set comment.
dup_pattern1 = r'</div>\s*\{/\* Duplicated Set for Infinite Scroll \*/\}\s*<div className="flex gap-4">\s*<Link href="/tools/standard-form".*?Fee Calculator</span>\s*</Link>\s*</div>\s*</div>'
new_end1 = r'</div>'
content = re.sub(dup_pattern1, new_end1, content, flags=re.DOTALL)


# 2. AI Powered Career Tools
marquee2_start = r'\{/\* Reverse Scrolling Marquee Container \*/\}\s*<div className="flex w-max animate-marquee-reverse gap-4">\s*\{/\* Original Set \*/\}\s*<div className="flex gap-4">'
new_marquee2_start = r'{/* Scrollable Container */}\n                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>'

content = re.sub(marquee2_start, new_marquee2_start, content)

# Duplicate set ends with "AI Resume Builder"
dup_pattern2 = r'</div>\s*\{/\* Duplicated Set for Infinite Scroll \*/\}\s*<div className="flex gap-4">\s*<Link href="/tools/career-advisor".*?AI Resume Builder</span>\s*</Link>\s*</div>\s*</div>'
content = re.sub(dup_pattern2, new_end1, content, flags=re.DOTALL)

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated scroll behavior")
