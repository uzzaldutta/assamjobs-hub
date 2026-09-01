import re
with open("src/app/practice/actions.ts", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("return { questionIds: [] };", 'return { sessionId: `sess_${Date.now()}_temp`, questionIds: [] };')
with open("src/app/practice/actions.ts", "w", encoding="utf-8") as f:
    f.write(content)
