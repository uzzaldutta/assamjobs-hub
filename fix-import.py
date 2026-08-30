with open('src/app/previous-papers/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { FileText, Clock, FileText, ArrowRight }", "import { Clock, FileText, ArrowRight }")

with open('src/app/previous-papers/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed import")
