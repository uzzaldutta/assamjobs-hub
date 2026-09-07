file_path = "src/app/admissions/page.tsx"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()
content = content.replace("const { data: records, count }", "const { data: admissions, count }")
with open(file_path, "w", encoding="utf-8") as f: f.write(content)

file_path = "src/app/tenders/page.tsx"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()
content = content.replace("const { data: records, count }", "const { data: tenders, count }")
content = content.replace("record.map", "tenders.map")
with open(file_path, "w", encoding="utf-8") as f: f.write(content)

file_path = "src/app/results/page.tsx"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()
content = content.replace("const { data: records, count }", "const { data: results, count }")
with open(file_path, "w", encoding="utf-8") as f: f.write(content)

file_path = "src/app/admit-cards/page.tsx"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()
content = content.replace("const { data: records, count }", "const { data: admitCards, count }")
with open(file_path, "w", encoding="utf-8") as f: f.write(content)

file_path = "src/app/scholarships/page.tsx"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()
content = content.replace("const { data: records, count }", "const { data: scholarships, count }")
with open(file_path, "w", encoding="utf-8") as f: f.write(content)

print("Fixed lists")
