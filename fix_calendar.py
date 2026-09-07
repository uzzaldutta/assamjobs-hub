file_path = "src/app/calendar/page.tsx"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()
content = content.replace(".neq('category', 'BANNED_KEYWORD')", ".eq('status', 'PUBLISHED')")
with open(file_path, "w", encoding="utf-8") as f: f.write(content)
print("Patched calendar to only show published jobs")
