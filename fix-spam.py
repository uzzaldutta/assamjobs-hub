with open('src/app/api/admin/spam-control/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("select('id, title, created_at')", "select('id, title, scraped_at')")
content = content.replace("order('created_at',", "order('scraped_at',")

with open('src/app/api/admin/spam-control/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed spam control GET API route")
