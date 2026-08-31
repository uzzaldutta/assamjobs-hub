with open('package.json', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('"dev": "next dev --turbopack"', '"dev": "next dev -p 9000 --turbopack"')

with open('package.json', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated package.json port to 9000")
