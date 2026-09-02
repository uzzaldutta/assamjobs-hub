with open("src/app/search/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

new_content = 'export const dynamic = "force-dynamic";\n\n' + content

with open("src/app/search/page.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)
