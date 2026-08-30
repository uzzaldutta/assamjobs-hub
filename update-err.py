with open('src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_error = """      if (!res.ok) throw new Error("Failed to add job");"""
new_error = """      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add job");"""

content = content.replace(old_error, new_error)

with open('src/app/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated frontend error handling")
