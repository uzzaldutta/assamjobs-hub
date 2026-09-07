import re

with open("src/app/layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace placeholder with the new publisher ID
content = content.replace("ca-pub-XXXXXXXXXXXXXXXX", "ca-pub-4651508083326671")

with open("src/app/layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AdSense publisher ID in layout.tsx")
