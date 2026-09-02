with open("src/app/admin/studio/review/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('"(\"A\",\"B\",\"C\",\"D\")"', "'(\"A\",\"B\",\"C\",\"D\")'")

with open("src/app/admin/studio/review/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
