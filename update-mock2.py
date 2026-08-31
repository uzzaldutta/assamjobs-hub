with open('src/app/mock-tests/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('{test.title}\n                  </h3>', '{test.title}\n                  </h3>\n                  <div className="text-[10px] text-slate-400 font-mono mb-4">ID: AJH-{test.id.slice(-6).toUpperCase()}</div>')

with open('src/app/mock-tests/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Mock Tests with Feed ID properly")
