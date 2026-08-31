with open('src/app/mock-tests/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
content = re.sub(r'(\{test\.title\}\s*</h3>)', r'\1\n                  <div className="text-[10px] text-slate-400 font-mono mb-4" title="Feed ID">ID: AJH-{test.id.slice(-6).toUpperCase()}</div>', content)

with open('src/app/mock-tests/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
