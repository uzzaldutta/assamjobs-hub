import re

with open('src/app/tools/eligibility-checker/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'(<p className="text-emerald-600 dark:text-emerald-500 max-w-sm">.*?</p>)', re.DOTALL)
replacement = r'''\1
              <p className="text-emerald-700/70 dark:text-emerald-400/70 max-w-sm text-xs mt-4 font-medium italic">
                Note: This tool helps you understand whether you may meet the stated requirements. Please clearly refer to the official notification for the final criteria.
              </p>'''
content = pattern.sub(replacement, content)

with open('src/app/tools/eligibility-checker/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
