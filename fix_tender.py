file_path = "src/app/tenders/page.tsx"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()
content = content.replace("key={record.id}", "key={tender.id}")
with open(file_path, "w", encoding="utf-8") as f: f.write(content)
