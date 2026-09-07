import re

with open("next.config.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("const nextConfig: NextConfig = {", "const nextConfig: any = {")

with open("next.config.ts", "w", encoding="utf-8") as f:
    f.write(content)
