file_path = "src/app/page.tsx"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()
content = content.replace('href="/practice"', 'href="/exams"')
with open(file_path, "w", encoding="utf-8") as f: f.write(content)
print("Patched practice links on homepage")
