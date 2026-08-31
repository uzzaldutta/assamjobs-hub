import re

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden', 'shadow-sm border border-slate-100 dark:border-slate-800')

# For the first one:
content = content.replace(
    '{/* Scrolling Marquee Container */}\n                      <div className="flex w-max animate-marquee gap-4">\n                        {/* Original Set */}\n                        <div className="flex gap-4">',
    '{/* Scrolling Container */}\n                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>'
)

p1 = r'</Link>\s*</div>\s*\{/\* Duplicated Set for Infinite Scroll \*/\}\s*<div className="flex gap-4">\s*<Link href="/tools/standard-form".*?Fee Calculator</span>\s*</Link>\s*</div>\s*</div>'
content = re.sub(p1, '</Link>\n                      </div>', content, flags=re.DOTALL)

# For the second one:
content = content.replace(
    '{/* Reverse Scrolling Marquee Container */}\n                      <div className="flex w-max animate-marquee-reverse gap-4">\n                        {/* Original Set */}\n                        <div className="flex gap-4">',
    '{/* Scrolling Container */}\n                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>'
)

p2 = r'</Link>\s*</div>\s*\{/\* Duplicated Set for Infinite Scroll \*/\}\s*<div className="flex gap-4">\s*<Link href="/tools/career-advisor".*?AI Cover Letter</span>\s*</Link>\s*</div>\s*</div>'
content = re.sub(p2, '</Link>\n                      </div>', content, flags=re.DOTALL)


with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated scroll behavior safely")
