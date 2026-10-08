import re

with open('src/lib/ingestion/pipeline.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r"if \(\s*qItem && finalStatus === 'NEW' && qualityScore >= 70 && \(source\.tier <= 2 \|\| source\.is_official \|\| normalized\.title\.toLowerCase\(\)\.includes\('govt'\) \|\| normalized\.title\.toLowerCase\(\)\.includes\('government'\) \|\| normalized\.title\.toLowerCase\(\)\.includes\('police'\) \|\| normalized\.title\.toLowerCase\(\)\.includes\('railway'\)\)\s*\) {",
    "if (qItem && finalStatus === 'NEW' && qualityScore >= 40) {",
    content
)

with open('src/lib/ingestion/pipeline.ts', 'w', encoding='utf-8') as f:
    f.write(content)