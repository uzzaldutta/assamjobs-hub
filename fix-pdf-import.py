with open("src/app/admin/studio/generator/pdfActions.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('import pdfParse from "pdf-parse";', 'const pdfParse = require("pdf-parse");')

with open("src/app/admin/studio/generator/pdfActions.ts", "w", encoding="utf-8") as f:
    f.write(content)
