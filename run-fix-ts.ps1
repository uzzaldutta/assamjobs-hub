code = """
import fs

def fix_file(filepath, replacements):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    for old, new in replacements.items():
        content = content.replace(old, new)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

fix_file("src/app/admissions/page.tsx", {'theme="emerald"': 'theme="green"'})
fix_file("src/app/results/page.tsx", {'theme="fuchsia"': 'theme="purple"', 'nullsLast: true': 'nullsFirst: false'})
fix_file("src/app/admit-cards/page.tsx", {'nullsLast: true': 'nullsFirst: false'})
fix_file("src/app/scholarships/page.tsx", {'theme="amber"': 'theme="orange"'})
"""
with open("fix-ts.py", "w", encoding="utf-8") as f:
    f.write(code)
