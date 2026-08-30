with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
if "QUICK_LINKS" in content:
    print("Found QUICK_LINKS")
else:
    print("NOT FOUND")
